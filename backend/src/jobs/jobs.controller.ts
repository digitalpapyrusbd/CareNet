import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, AssignCaregiverDto } from './dto/job.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles(UserRole.GUARDIAN)
  create(
    @CurrentUser('id') userId: string,
    @Body() createJobDto: CreateJobDto,
  ) {
    return this.jobsService.create(userId, createJobDto);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.jobsService.findAll(userId, userRole, +page, +limit);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.jobsService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  @Roles(UserRole.GUARDIAN)
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, userId, updateJobDto);
  }

  @Patch(':id/assign')
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER)
  assignCaregivers(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() assignDto: AssignCaregiverDto,
  ) {
    return this.jobsService.assignCaregivers(id, userId, assignDto);
  }

  @Patch(':id/accept')
  @Roles(UserRole.CAREGIVER)
  acceptJob(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.jobsService.acceptJob(id, userId);
  }

  @Patch(':id/complete')
  @Roles(UserRole.GUARDIAN)
  completeJob(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.jobsService.completeJob(id, userId);
  }

  @Delete(':id')
  @Roles(UserRole.GUARDIAN)
  cancelJob(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.jobsService.cancelJob(id, userId);
  }
}
