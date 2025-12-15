import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCareLogDto } from './dto/create-care-log.dto';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Injectable()
export class CareLogsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCareLogDto: CreateCareLogDto) {
    // Find caregiver by user_id
    const caregiver = await this.prisma.caregivers.findFirst({
      where: { userId: userId },
    });

    if (!caregiver) {
      return {
        statusCode: 404,
        message: 'Caregiver profile not found',
        data: null,
      };
    }

    const careLog = await this.prisma.care_logs.create({
      data: {
        caregiver_id: caregiver.id,
        job_id: createCareLogDto.job_id,
        patient_id: createCareLogDto.patient_id,
        log_type: createCareLogDto.log_type,
        timestamp: new Date(),
        location_lat: createCareLogDto.location_lat,
        location_lng: createCareLogDto.location_lng,
        data: createCareLogDto.data || {},
        notes: createCareLogDto.notes,
        photo_urls: createCareLogDto.photo_urls || [],
      },
    });

    return {
      statusCode: 201,
      message: 'Care log created successfully',
      data: careLog,
    };
  }

  async checkIn(userId: string, dto: CheckInDto) {
    // Find caregiver by user_id
    const caregiver = await this.prisma.caregivers.findFirst({
      where: { userId: userId },
    });

    if (!caregiver) {
      return {
        statusCode: 404,
        message: 'Caregiver profile not found',
        data: null,
      };
    }

    const careLog = await this.prisma.care_logs.create({
      data: {
        caregiver_id: caregiver.id,
        job_id: dto.job_id,
        patient_id: dto.patient_id,
        log_type: 'CHECK_IN',
        timestamp: new Date(),
        location_lat: dto.location.latitude,
        location_lng: dto.location.longitude,
        data: {
          checkInTime: new Date().toISOString(),
        },
        notes: null,
        photo_urls: [],
      },
    });

    return {
      statusCode: 201,
      message: 'Check-in recorded successfully',
      data: careLog,
    };
  }

  async checkOut(userId: string, dto: CheckOutDto) {
    // Find caregiver by user_id
    const caregiver = await this.prisma.caregivers.findFirst({
      where: { userId: userId },
    });

    if (!caregiver) {
      return {
        statusCode: 404,
        message: 'Caregiver profile not found',
        data: null,
      };
    }

    const careLog = await this.prisma.care_logs.create({
      data: {
        caregiver_id: caregiver.id,
        job_id: dto.job_id,
        patient_id: dto.patient_id,
        log_type: 'CHECK_OUT',
        timestamp: new Date(),
        location_lat: dto.location.latitude,
        location_lng: dto.location.longitude,
        data: {
          checkOutTime: new Date().toISOString(),
        },
        notes: dto.final_notes,
        photo_urls: [],
      },
    });

    return {
      statusCode: 201,
      message: 'Check-out recorded successfully',
      data: careLog,
    };
  }

  async update(id: string, dto: UpdateLogDto) {
    const careLog = await this.prisma.care_logs.update({
      where: { id },
      data: {
        notes: dto.notes,
        photo_urls: dto.photoUrls,
        data: dto.data,
      },
      include: {
        caregiver: {
          select: {
            id: true,
            phone: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: 'Care log updated successfully',
      data: careLog,
    };
  }

  async findByJob(jobId: string) {
    const careLogs = await this.prisma.care_logs.findMany({
      where: { job_id: jobId },
      include: {
        caregiver: {
          select: {
            id: true,
            phone: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return {
      statusCode: 200,
      message: 'Care logs retrieved successfully',
      data: careLogs,
    };
  }

  async findByPatient(patientId: string) {
    const careLogs = await this.prisma.care_logs.findMany({
      where: { patient_id: patientId },
      include: {
        caregiver: {
          select: {
            id: true,
            phone: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return {
      statusCode: 200,
      message: 'Care logs retrieved successfully',
      data: careLogs,
    };
  }

  async findOne(id: string) {
    const careLog = await this.prisma.care_logs.findUnique({
      where: { id },
      include: {
        caregiver: {
          select: {
            id: true,
            phone: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
        job: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!careLog) {
      return {
        statusCode: 404,
        message: 'Care log not found',
        data: null,
      };
    }

    return {
      statusCode: 200,
      message: 'Care log retrieved successfully',
      data: careLog,
    };
  }
}