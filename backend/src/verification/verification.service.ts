import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  SubmitVerificationStepDto,
  ModeratorReviewDto,
  AdminReviewDto,
} from './dto/verification.dto';
import {
  VerificationStepType,
  VerificationDecision,
  UserRole,
} from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Submit a verification step (Caregiver or Agency)
   */
  async submitStep(userId: string, submitDto: SubmitVerificationStepDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if step already exists
    const existingStep = await this.prisma.verification_steps.findUnique({
      where: {
        user_id_step_type: {
          user_id: userId,
          step_type: submitDto.step_type,
        },
      },
    });

    if (
      existingStep &&
      existingStep.admin_decision === VerificationDecision.ADMIN_APPROVED
    ) {
      throw new BadRequestException('This step is already approved');
    }

    // Determine step order based on type
    const stepOrder = this.getStepOrder(submitDto.step_type);

    const step = await this.prisma.verification_steps.upsert({
      where: {
        user_id_step_type: {
          user_id: userId,
          step_type: submitDto.step_type,
        },
      },
      update: {
        document_urls: submitDto.document_urls || [],
        admin_decision: VerificationDecision.PENDING,
        moderator_decision: null,
        moderator_notes: null,
        admin_notes: null,
        resubmit_reason: null,
      },
      create: {
        user_id: userId,
        step_type: submitDto.step_type,
        step_order: stepOrder,
        document_urls: submitDto.document_urls || [],
        admin_decision: VerificationDecision.PENDING,
      },
    });

    return step;
  }

  /**
   * Get all pending verifications (Moderator view)
   */
  async getPendingVerifications(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [steps, total] = await Promise.all([
      this.prisma.verification_steps.findMany({
        where: {
          admin_decision: VerificationDecision.PENDING,
          moderator_decision: null,
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
        },
        orderBy: { created_at: 'asc' },
      }),
      this.prisma.verification_steps.count({
        where: {
          admin_decision: VerificationDecision.PENDING,
          moderator_decision: null,
        },
      }),
    ]);

    return {
      data: steps,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Moderator review (first tier)
   */
  async moderatorReview(
    stepId: string,
    moderatorId: string,
    reviewDto: ModeratorReviewDto,
  ) {
    const step = await this.prisma.verification_steps.findUnique({
      where: { id: stepId },
    });

    if (!step) {
      throw new NotFoundException('Verification step not found');
    }

    if (step.admin_decision !== VerificationDecision.PENDING) {
      throw new BadRequestException(
        'This step has already been reviewed by admin',
      );
    }

    const updatedStep = await this.prisma.verification_steps.update({
      where: { id: stepId },
      data: {
        moderator_id: moderatorId,
        moderator_notes: reviewDto.notes,
        moderator_decision: new Date(),
      },
    });

    return updatedStep;
  }

  /**
   * Get moderator-reviewed verifications (Admin view)
   */
  async getModeratorReviewed(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [steps, total] = await Promise.all([
      this.prisma.verification_steps.findMany({
        where: {
          admin_decision: VerificationDecision.PENDING,
          moderator_decision: { not: null },
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
        },
        orderBy: { moderator_decision: 'asc' },
      }),
      this.prisma.verification_steps.count({
        where: {
          admin_decision: VerificationDecision.PENDING,
          moderator_decision: { not: null },
        },
      }),
    ]);

    return {
      data: steps,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Admin review (final tier)
   */
  async adminReview(
    stepId: string,
    adminId: string,
    reviewDto: AdminReviewDto,
  ) {
    const step = await this.prisma.verification_steps.findUnique({
      where: { id: stepId },
      include: { user: true },
    });

    if (!step) {
      throw new NotFoundException('Verification step not found');
    }

    const updatedStep = await this.prisma.verification_steps.update({
      where: { id: stepId },
      data: {
        admin_id: adminId,
        admin_notes: reviewDto.notes,
        admin_decision: reviewDto.decision,
        admin_decided_at: new Date(),
        resubmit_reason: reviewDto.resubmit_reason,
      },
    });

    // If all steps approved, mark user/caregiver as verified
    if (reviewDto.decision === VerificationDecision.ADMIN_APPROVED) {
      await this.checkAndMarkVerified(step.user_id);
    }

    return updatedStep;
  }

  /**
   * Get user's verification status
   */
  async getUserVerificationStatus(userId: string) {
    const steps = await this.prisma.verification_steps.findMany({
      where: { user_id: userId },
      orderBy: { step_order: 'asc' },
    });

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const requiredSteps = this.getRequiredSteps(user?.role);
    const completedSteps = steps.filter(
      (s) => s.admin_decision === VerificationDecision.ADMIN_APPROVED,
    ).length;

    return {
      steps,
      totalSteps: requiredSteps.length,
      completedSteps,
      isFullyVerified: completedSteps === requiredSteps.length,
    };
  }

  /**
   * Check if all required steps are approved and mark as verified
   */
  private async checkAndMarkVerified(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const requiredSteps = this.getRequiredSteps(user.role);
    const approvedSteps = await this.prisma.verification_steps.count({
      where: {
        user_id: userId,
        admin_decision: VerificationDecision.ADMIN_APPROVED,
      },
    });

    if (approvedSteps === requiredSteps.length) {
      // Mark user as verified
      await this.prisma.users.update({
        where: { id: userId },
        data: { kyc_status: 'VERIFIED' },
      });

      // If caregiver, mark caregiver as verified
      if (user.role === UserRole.CAREGIVER) {
        await this.prisma.caregivers.updateMany({
          where: { userId },
          data: { is_verified: true },
        });
      }

      // If agency, mark company as verified
      if (
        user.role === UserRole.AGENCY_ADMIN ||
        user.role === UserRole.AGENCY_MANAGER
      ) {
        await this.prisma.companies.updateMany({
          where: { userId },
          data: { is_verified: true },
        });
      }
    }
  }

  /**
   * Get required verification steps based on role
   */
  private getRequiredSteps(role?: UserRole): VerificationStepType[] {
    if (role === UserRole.CAREGIVER) {
      return [
        VerificationStepType.CERTIFICATES,
        VerificationStepType.POLICE_CLEARANCE,
        VerificationStepType.INTERVIEW,
        VerificationStepType.PSYCHOLOGICAL_ANALYSIS,
        VerificationStepType.DOCUMENT_CHECK,
        VerificationStepType.FINAL_APPROVAL,
      ];
    }

    if (role === UserRole.AGENCY_ADMIN || role === UserRole.AGENCY_MANAGER) {
      return [
        VerificationStepType.DOCUMENT_CHECK,
        VerificationStepType.FINAL_APPROVAL,
      ];
    }

    return [];
  }

  /**
   * Get step order number
   */
  private getStepOrder(stepType: VerificationStepType): number {
    const orderMap: Record<VerificationStepType, number> = {
      [VerificationStepType.CERTIFICATES]: 1,
      [VerificationStepType.POLICE_CLEARANCE]: 2,
      [VerificationStepType.INTERVIEW]: 3,
      [VerificationStepType.PSYCHOLOGICAL_ANALYSIS]: 4,
      [VerificationStepType.DOCUMENT_CHECK]: 5,
      [VerificationStepType.FINAL_APPROVAL]: 6,
    };

    return orderMap[stepType] || 0;
  }
}
