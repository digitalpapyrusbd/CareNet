import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  async create(@Request() req, @Body() dto: any) {
    return this.feedbackService.create(req.user.userId, dto);
  }

  @Get('caregiver/:id')
  async getCaregiverRatings(@Param('id') id: string) {
    return this.feedbackService.getCaregiverRatings(id);
  }
}
