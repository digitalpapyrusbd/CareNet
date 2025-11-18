import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    return await this.patientsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    return await this.patientsService.findOne(id, userId);
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto, @Req() req: Request) {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    return await this.patientsService.create(createPatientDto, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    return await this.patientsService.update(id, userId, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    return await this.patientsService.remove(id, userId);
  }
}