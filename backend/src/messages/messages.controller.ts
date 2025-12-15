import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConversationDto, SendMessageDto } from './dto/message.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('conversations')
  createConversation(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateConversationDto,
  ) {
    return this.messagesService.createConversation(userId, createDto);
  }

  @Get('conversations')
  getConversations(@CurrentUser('id') userId: string) {
    return this.messagesService.getUserConversations(userId);
  }

  @Post('send')
  sendMessage(
    @CurrentUser('id') userId: string,
    @Body() sendDto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(userId, sendDto);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.messagesService.getConversationMessages(
      conversationId,
      userId,
      +page,
      +limit,
    );
  }

  @Patch('conversations/:id/read')
  markAsRead(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.messagesService.markAsRead(conversationId, userId);
  }
}
