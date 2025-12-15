import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { CareLogsService } from './care-logs.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCareLogDto, UpdateCareLogDto } from './dto/care-log.dto';

@Controller('care-logs')
export class CareLogsController {
  constructor(private readonly careLogsService: CareLogsService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCareLogDto) {
    return this.careLogsService.create(userId, dto.job_id, dto);
  }

  @Get('job/:jobId')
  findByJob(@Param('jobId') jobId: string) {
    return this.careLogsService.findByJob(jobId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.careLogsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCareLogDto) {
    return this.careLogsService.update(id, dto);
  }
}
