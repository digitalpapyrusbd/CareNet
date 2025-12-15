import { Controller, Post, Get, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CareLogsService } from './care-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCareLogDto } from './dto/create-care-log.dto';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Controller('care-logs')
@UseGuards(JwtAuthGuard)
export class CareLogsController {
  constructor(private readonly careLogsService: CareLogsService) {}

  @Post()
  async create(@Req() req: any, @Body() createCareLogDto: CreateCareLogDto) {
    const userId = req.user?.userId || req.user?.id;
    return await this.careLogsService.create(userId, createCareLogDto);
  }

  @Post('check-in')
  async checkIn(@Req() req: any, @Body() dto: CheckInDto) {
    const userId = req.user?.userId || req.user?.id;
    return await this.careLogsService.checkIn(userId, dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLogDto) {
    return await this.careLogsService.update(id, dto);
  }

  @Post('check-out')
  async checkOut(@Req() req: any, @Body() dto: CheckOutDto) {
    const userId = req.user?.userId || req.user?.id;
    return await this.careLogsService.checkOut(userId, dto);
  }

  @Get('job/:jobId')
  async findByJob(@Param('jobId') jobId: string) {
    return await this.careLogsService.findByJob(jobId);
  }

  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string) {
    return await this.careLogsService.findByPatient(patientId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.careLogsService.findOne(id);
  }
}