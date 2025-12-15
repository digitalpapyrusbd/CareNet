import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(guardianId: string, createPatientDto: CreatePatientDto) {
    const patient = await this.prisma.patients.create({
      data: {
        guardian_id: guardianId,
        ...createPatientDto,
        date_of_birth: new Date(createPatientDto.date_of_birth),
      },
    });

    return patient;
  }

  async findAll(guardianId: string) {
    const patients = await this.prisma.patients.findMany({
      where: {
        guardian_id: guardianId,
        deletedAt: null,
      },
    });

    return patients;
  }

  async findOne(id: string, guardianId: string) {
    const patient = await this.prisma.patients.findUnique({
      where: { id },
      include: {
        health_records: {
          where: { is_archived: false },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!patient || patient.deletedAt) {
      throw new NotFoundException('Patient not found');
    }

    if (patient.guardian_id !== guardianId) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    return patient;
  }

  async update(
    id: string,
    guardianId: string,
    updatePatientDto: UpdatePatientDto,
  ) {
    const patient = await this.prisma.patients.findUnique({
      where: { id },
    });

    if (!patient || patient.guardian_id !== guardianId) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.patients.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  async remove(id: string, guardianId: string) {
    const patient = await this.prisma.patients.findUnique({
      where: { id },
    });

    if (!patient || patient.guardian_id !== guardianId) {
      throw new NotFoundException('Patient not found');
    }

    await this.prisma.patients.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Patient deleted successfully' };
  }
}
