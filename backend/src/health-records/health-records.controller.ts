import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HealthRecordsService, CreateHealthRecordDto } from './health-records.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('health-records')
@Roles(UserRole.GUARDIAN, UserRole.CAREGIVER)
export class HealthRecordsController {
  constructor(private readonly healthRecordsService: HealthRecordsService) { }

  @Post()
  create(@Body() data: CreateHealthRecordDto) {
    return this.healthRecordsService.create(data.patient_id, data);
  }

  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.healthRecordsService.findByPatient(patientId);
  }
}
