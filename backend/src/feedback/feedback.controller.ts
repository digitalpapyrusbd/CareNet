import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import type { CreateFeedbackDto } from './feedback.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() data: CreateFeedbackDto) {
    return this.feedbackService.create(userId, data);
  }

  @Get()
  findByTarget(@Query('type') type: string, @Query('id') id: string) {
    return this.feedbackService.findByTarget(type, id);
  }
}
