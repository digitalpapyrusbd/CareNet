import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const patients = await this.prisma.patients.findMany({
      where: {
        guardian_id: userId,
        deletedAt: null,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      statusCode: 200,
      message: 'Patients retrieved successfully',
      data: patients,
    };
  }

  async findOne(id: string, userId: string) {
    const patient = await this.prisma.patients.findFirst({
      where: {
        id,
        guardian_id: userId,
        deletedAt: null,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!patient) {
      return {
        statusCode: 404,
        message: 'Patient not found',
        data: null,
      };
    }

    return {
      statusCode: 200,
      message: 'Patient retrieved successfully',
      data: patient,
    };
  }

  async create(createPatientDto: CreatePatientDto, userId: string) {
    const patient = await this.prisma.patients.create({
      data: {
        user_id: userId,
        guardian_id: userId,
        name: createPatientDto.name,
        date_of_birth: new Date(createPatientDto.date_of_birth),
        gender: createPatientDto.gender,
        address: createPatientDto.address,
        blood_group: createPatientDto.blood_group,
        emergency_contact_name: createPatientDto.emergency_contact_name || '',
        emergency_contact_phone: createPatientDto.emergency_contact_phone || '',
        primaryConditions: createPatientDto.primaryConditions,
        allergies: createPatientDto.allergies,
        mobility_level: createPatientDto.mobility_level,
        cognitive_status: createPatientDto.cognitive_status,
        photoUrl: createPatientDto.photoUrl,
        consent_data_sharing: createPatientDto.consent_data_sharing || false,
        consent_marketing: createPatientDto.consent_marketing || false,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return {
      statusCode: 201,
      message: 'Patient created successfully',
      data: patient,
    };
  }

  async update(id: string, userId: string, updatePatientDto: UpdatePatientDto) {
    // First check if patient belongs to this guardian
    const patient = await this.prisma.patients.findFirst({
      where: {
        id,
        guardian_id: userId,
        deletedAt: null,
      },
    });

    if (!patient) {
      return {
        statusCode: 404,
        message: 'Patient not found',
        data: null,
      };
    }

    const updatedPatient = await this.prisma.patients.update({
      where: { id },
      data: {
        name: updatePatientDto.name,
        date_of_birth: updatePatientDto.date_of_birth
          ? new Date(updatePatientDto.date_of_birth)
          : patient.date_of_birth,
        gender: updatePatientDto.gender,
        address: updatePatientDto.address,
        blood_group: updatePatientDto.blood_group,
        emergency_contact_name: updatePatientDto.emergency_contact_name || patient.emergency_contact_name,
        emergency_contact_phone: updatePatientDto.emergency_contact_phone || patient.emergency_contact_phone,
        primaryConditions: updatePatientDto.primaryConditions,
        allergies: updatePatientDto.allergies,
        mobility_level: updatePatientDto.mobility_level,
        cognitive_status: updatePatientDto.cognitive_status,
        photoUrl: updatePatientDto.photoUrl,
        consent_data_sharing: updatePatientDto.consent_data_sharing,
        consent_marketing: updatePatientDto.consent_marketing,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: 'Patient updated successfully',
      data: updatedPatient,
    };
  }

  async remove(id: string, userId: string) {
    // First check if patient belongs to this guardian
    const patient = await this.prisma.patients.findFirst({
      where: {
        id,
        guardian_id: userId,
        deletedAt: null,
      },
    });

    if (!patient) {
      return {
        statusCode: 404,
        message: 'Patient not found',
        data: null,
      };
    }

    const deletedPatient = await this.prisma.patients.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: 'Patient deleted successfully',
      data: deletedPatient,
    };
  }
}