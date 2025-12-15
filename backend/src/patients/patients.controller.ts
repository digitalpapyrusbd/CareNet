import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('patients')
@Roles(UserRole.GUARDIAN)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(
    @CurrentUser('id') guardianId: string,
    @Body() createPatientDto: CreatePatientDto,
  ) {
    return this.patientsService.create(guardianId, createPatientDto);
  }

  @Get()
  findAll(@CurrentUser('id') guardianId: string) {
    return this.patientsService.findAll(guardianId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') guardianId: string) {
    return this.patientsService.findOne(id, guardianId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') guardianId: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, guardianId, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') guardianId: string) {
    return this.patientsService.remove(id, guardianId);
  }
}
