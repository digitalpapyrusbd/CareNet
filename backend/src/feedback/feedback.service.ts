import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { FeedbackType } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    // Create feedback
    const feedback = await this.prisma.feedbacks.create({
      data: {
        job_id: dto.job_id,
        from_user_id: userId,
        to_user_id: dto.caregiver_id,
        rating: dto.rating,
        comments: dto.comment,
        reviewee_type: FeedbackType.CAREGIVER,
      },
    });

    // Update caregiver aggregate ratings
    const avgRating = await this.prisma.feedbacks.aggregate({
      where: { to_user_id: dto.caregiver_id },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.caregivers.updateMany({
      where: { userId: dto.caregiver_id },
      data: {
        rating_avg: avgRating._avg.rating || 0,
        rating_count: avgRating._count,
      },
    });

    return feedback;
  }

  async getCaregiverRatings(caregiverId: string) {
    const caregiver = await this.prisma.caregivers.findFirst({
      where: { userId: caregiverId },
    });

    const reviews = await this.prisma.feedbacks.findMany({
      where: { to_user_id: caregiverId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      average_rating: caregiver?.rating_avg || 0,
      total_reviews: caregiver?.rating_count || 0,
      reviews,
    };
  }

  async updateAggregateRatings(userId: string, revieweeType: string, rating: number) {
    const avgRating = await this.prisma.feedbacks.aggregate({
      where: { to_user_id: userId },
      _avg: { rating: true },
      _count: true,
    });

    if (revieweeType === 'CAREGIVER') {
      const caregiver = await this.prisma.caregivers.findFirst({
        where: { userId },
      });
      
      if (caregiver) {
        await this.prisma.caregivers.update({
          where: { id: caregiver.id },
          data: {
            rating_avg: avgRating._avg.rating || 0,
            rating_count: avgRating._count,
          },
        });
      }
    } else if (revieweeType === 'COMPANY') {
      const company = await this.prisma.companies.findFirst({
        where: { userId },
      });
      
      if (company) {
        await this.prisma.companies.update({
          where: { id: company.id },
          data: {
            rating_avg: avgRating._avg.rating || 0,
            rating_count: avgRating._count,
          },
        });
      }
    }
  }

  async findByUser(userId: string) {
    return this.prisma.feedbacks.findMany({
      where: { to_user_id: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        users_feedbacks_from_user_idTousers: {
          select: { name: true, role: true },
        },
      },
    });
  }

  async findByJob(jobId: string) {
    return this.prisma.feedbacks.findMany({
      where: { job_id: jobId },
      include: {
        users_feedbacks_from_user_idTousers: {
          select: { name: true, role: true },
        },
        users_feedbacks_to_user_idTousers: {
          select: { name: true, role: true },
        },
      },
    });
  }

  async respond(feedbackId: string, dto: any) {
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return this.prisma.feedbacks.update({
      where: { id: feedbackId },
      data: {
        company_response: dto.company_response,
        responded_at: new Date(),
      },
    });
  }
}