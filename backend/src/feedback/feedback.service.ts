
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { FeedbackType } from '@prisma/client';

export interface CreateFeedbackDto {
  job_id: string;
  to_user_id: string;
  rating: number;
  comments?: string;
  reviewee_type: FeedbackType;
  tags?: string[];
}

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) { }

  async create(fromUserId: string, data: CreateFeedbackDto) {
    // data should contain: job_id, to_user_id, rating, comments, reviewee_type
    const feedback = await this.prisma.feedbacks.create({
      data: {
        job_id: data.job_id,
        from_user_id: fromUserId,
        to_user_id: data.to_user_id,
        reviewee_type: data.reviewee_type,
        rating: data.rating,
        comments: data.comments,
        tags: data.tags || [],
      },
    });

    // Update average rating
    await this.updateAverageRating(data.to_user_id, data.reviewee_type);

    return feedback;
  }

  async findByTarget(targetType: string, targetId: string) {
    // targetType should match FeedbackType logic or just filter by to_user_id
    const feedback = await this.prisma.feedbacks.findMany({
      where: {
        to_user_id: targetId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return feedback;
  }

  private async updateAverageRating(userId: string, type: FeedbackType) {
    const aggregates = await this.prisma.feedbacks.aggregate({
      where: { to_user_id: userId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avg = aggregates._avg.rating || 0;
    const count = aggregates._count.rating || 0;

    if (type === FeedbackType.CAREGIVER) {
      await this.prisma.caregivers.update({
        where: { userId: userId },
        data: { rating_avg: avg, rating_count: count },
      });
    } else if (type === FeedbackType.COMPANY) {
      await this.prisma.companies.update({
        where: { userId: userId },
        data: { rating_avg: avg, rating_count: count },
      });
    }
    // Guardian rating? Not in schema explicit average field mostly.
  }
}
