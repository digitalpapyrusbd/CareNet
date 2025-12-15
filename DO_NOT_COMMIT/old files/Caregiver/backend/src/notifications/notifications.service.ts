import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notifications.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        channel: dto.channel,
        title: dto.title,
        body: dto.body,
        data: dto.data || {},
        status: 'PENDING',
      },
    });

    // Trigger actual sending based on type
    await this.sendNotification(notification);

    return notification;
  }

  async sendNotification(notification: any) {
    // Update status to SENT for now
    // In production, integrate with actual services
    await this.prisma.notifications.update({
      where: { id: notification.id },
      data: {
        status: 'SENT',
        sent_at: new Date(),
      },
    });
  }

  async sendSMS(phone: string, message: string) {
    // Twilio integration placeholder
    console.log(`Sending SMS to ${phone}: ${message}`);
    // TODO: Implement actual Twilio integration
    return { success: true, message: 'SMS queued for delivery' };
  }

  async sendEmail(email: string, subject: string, body: string) {
    // SendGrid integration placeholder
    console.log(`Sending email to ${email}: ${subject}`);
    // TODO: Implement actual SendGrid integration
    return { success: true, message: 'Email queued for delivery' };
  }

  async sendPush(userId: string, title: string, body: string) {
    // Web Push API placeholder
    console.log(`Sending push to user ${userId}: ${title}`);
    // TODO: Implement actual Web Push integration
    return { success: true, message: 'Push notification queued' };
  }

  async findByUser(userId: string) {
    return this.prisma.notifications.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notifications.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notifications.update({
      where: { id },
      data: {
        status: 'READ',
        read_at: new Date(),
      },
    });
  }

  async delete(id: string, userId: string) {
    const notification = await this.prisma.notifications.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notifications.delete({
      where: { id },
    });
  }
}
