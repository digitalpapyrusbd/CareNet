import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    return this.prisma.disputes.create({
      data: {
        job_id: dto.job_id,
        raised_by: userId,
        against: dto.against || null,
        description: dto.subject,
        dispute_type: (dto.category as any) || 'OTHER',
      },
    });
  }

  async findAll() {
    return this.prisma.disputes.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        jobs: {
          select: {
            id: true,
            start_date: true,
            patients: { select: { name: true } },
          },
        },
        users_disputes_raised_byTousers: {
          select: { name: true, role: true, phone: true },
        },
        users_disputes_againstTousers: {
          select: { name: true, role: true, phone: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const dispute = await this.prisma.disputes.findUnique({
      where: { id },
      include: {
        jobs: {
          select: {
            id: true,
            start_date: true,
            patients: { select: { name: true } },
          },
        },
        users_disputes_raised_byTousers: {
          select: { name: true, role: true, phone: true },
        },
        users_disputes_againstTousers: {
          select: { name: true, role: true, phone: true },
        },
      },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    return dispute;
  }

  async assign(id: string, dto: any) {
    const dispute = await this.findOne(id);

    if (dispute.status !== 'OPEN') {
      throw new BadRequestException('Dispute is not open for assignment');
    }

    return this.prisma.disputes.update({
      where: { id },
      data: {
        assigned_moderator: dto.assigned_moderator,
        status: 'UNDER_REVIEW',
      },
    });
  }

  async resolve(id: string, dto: any) {
    const dispute = await this.findOne(id);

    if (dispute.status === 'RESOLVED' || dispute.status === 'CLOSED') {
      throw new BadRequestException('Dispute already resolved');
    }

    const updated = await this.prisma.disputes.update({
      where: { id },
      data: {
        resolution: dto.resolution,
        resolution_action: dto.resolution_action,
        status: 'RESOLVED',
        resolved_at: new Date(),
      },
    });

    // Handle refund if needed
    if (dto.resolution_action === 'refund') {
      const payment = await this.prisma.payments.findFirst({
        where: { job_id: dispute.job_id },
      });

      if (payment) {
        await this.prisma.payments.update({
          where: { id: payment.id },
          data: { status: 'REFUNDED' },
        });
      }
    }

    // TODO: Send notifications to all parties

    return updated;
  }
}