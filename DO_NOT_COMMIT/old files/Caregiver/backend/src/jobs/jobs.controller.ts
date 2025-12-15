import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateJobDto } from './dto/create-job.dto';
import { AssignmentRole } from '@prisma/client';
import { AssignCaregiverDto } from './dto/assign-caregiver.dto';

type AuthenticatedRequest = Request & {
  user?: {
    userId?: string;
    id?: string;
  };
};

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll() {
    return await this.jobsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.jobsService.findOne(id);
  }

  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) {
      throw new BadRequestException('Missing authenticated user');
    }

    return await this.jobsService.create(createJobDto, userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: any) {
    return await this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.jobsService.remove(id);
  }

  @Post(':id/assign')
  async assignCaregiver(
    @Param('id') id: string,
    @Body() body: { caregiverId: string; role?: AssignmentRole },
  ) {
    return await this.jobsService.assignCaregiver(
      id,
      body.caregiverId,
      body.role,
    );
  }

  @Post('assign')
  async assignCaregiverToJob(@Body() dto: AssignCaregiverDto) {
    return this.jobsService.assignCaregiver(
      dto.job_id,
      dto.caregiver_id,
      dto.role,
      dto.shift_start_time,
      dto.shift_end_time,
      dto.days_of_week,
    );
  }

  @Post(':id/complete')
  async completeJob(
    @Param('id') id: string,
    @Body() body: { completionNotes?: string },
  ) {
    return await this.jobsService.completeJob(id, body.completionNotes);
  }

  @Post(':id/cancel')
  async cancelJob(
    @Param('id') id: string,
    @Body() body: { reason: string; cancelledBy: string },
  ) {
    return await this.jobsService.cancelJob(id, body.reason, body.cancelledBy);
  }
}
