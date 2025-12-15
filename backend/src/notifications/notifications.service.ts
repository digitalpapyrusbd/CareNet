import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationType, NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.IN_APP,
  ) {
    const notification = await this.prisma.notifications.create({
      data: {
        userId: userId, // camelCase as per schema
        title,
        body: message, // body as per schema
        type,
        channel: type === NotificationType.IN_APP ? 'IN_APP' : 'PUSH',
        status: NotificationStatus.PENDING,
      },
    });

    // TODO: Integrate with FCM/Twilio/SendGrid based on type

    return notification;
  }

  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notifications.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // createdAt camelCase
      }),
      this.prisma.notifications.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(id: string, userId?: string) {
    await this.prisma.notifications.update({
      where: { id },
      data: {
        status: NotificationStatus.READ,
        read_at: new Date(),
      },
    });

    return { message: 'Notification marked as read' };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notifications.updateMany({
      where: { userId, read_at: null },
      data: {
        status: NotificationStatus.READ,
        read_at: new Date(),
      },
    });

    return { message: 'All notifications marked as read' };
  }
}
