import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateConversationDto, SendMessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userId: string, createDto: CreateConversationDto) {
    if (!createDto.participant_ids.includes(userId)) {
      createDto.participant_ids.push(userId);
    }

    const conversation = await this.prisma.conversations.create({
      data: {
        participant_ids: createDto.participant_ids,
        type: createDto.type,
        created_by: userId,
      },
    });

    return conversation;
  }

  async getUserConversations(userId: string) {
    // Simple query without JSON filter
    const allConversations = await this.prisma.conversations.findMany({
      include: {
        messages: {
          take: 1,
          orderBy: { created_at: 'desc' },
        },
      },
      orderBy: { last_message_at: 'desc' },
    });

    // Filter in application code
    return allConversations.filter((conv) => {
      const participants = conv.participant_ids as any;
      return Array.isArray(participants) && participants.includes(userId);
    });
  }

  async sendMessage(userId: string, sendDto: SendMessageDto) {
    const conversation = await this.prisma.conversations.findUnique({
      where: { id: sendDto.conversation_id },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const participantIds = conversation.participant_ids as string[];
    if (!participantIds.includes(userId)) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    const message = await this.prisma.messages.create({
      data: {
        conversation_id: sendDto.conversation_id,
        sender_id: userId,
        content: sendDto.content,
        attachment_urls: sendDto.attachment_urls || [],
      },
    });

    await this.prisma.conversations.update({
      where: { id: sendDto.conversation_id },
      data: { last_message_at: new Date() },
    });

    return message;
  }

  async getConversationMessages(
    conversationId: string,
    userId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const conversation = await this.prisma.conversations.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const participantIds = conversation.participant_ids as string[];
    if (!participantIds.includes(userId)) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.messages.findMany({
        where: { conversation_id: conversationId },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.messages.count({
        where: { conversation_id: conversationId },
      }),
    ]);

    return {
      data: messages.reverse(),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(conversationId: string, userId: string) {
    await this.prisma.messages.updateMany({
      where: {
        conversation_id: conversationId,
        sender_id: { not: userId },
        is_read: false,
      },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });

    return { success: true };
  }
}
