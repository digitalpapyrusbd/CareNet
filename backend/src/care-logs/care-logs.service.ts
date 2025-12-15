import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CareLogType, Prisma } from '@prisma/client';
import { CreateCareLogDto, UpdateCareLogDto } from './dto/care-log.dto';

@Injectable()
export class CareLogsService {
  constructor(private prisma: PrismaService) {}

  async create(caregiverId: string, jobId: string, data: CreateCareLogDto) {
    const job = await this.prisma.jobs.findUnique({
      where: { id: jobId },
      include: {
        assignments: {
          where: { caregiver_id: { in: [caregiverId] } },
        },
      },
    });

    if (!job) throw new NotFoundException('Job not found');

    // Resolve caregiver entity id from userId (caregiverId passed here is usually userId from controller)
    const caregiver = await this.prisma.caregivers.findUnique({
      where: { userId: caregiverId },
    });
    if (!caregiver) throw new NotFoundException('Caregiver profile not found');

    // Find assignment
    const assignment = await this.prisma.assignments.findFirst({
      where: { job_id: jobId, caregiver_id: caregiver.id },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const log = await this.prisma.care_logs.create({
      data: {
        job_id: jobId,
        assignment_id: assignment.id,
        caregiver_id: caregiver.id,
        patient_id: job.patient_id,
        log_type: data.log_type || CareLogType.ACTIVITY,
        timestamp: new Date(),
        data: (data.data || {}) as Prisma.InputJsonValue,
        notes: data.notes,
        vitals: data.vitals as Prisma.InputJsonValue,
        activities: data.activities as Prisma.InputJsonValue,
        photo_urls: data.photoUrls || [],
      },
    });

    return log;
  }

  async update(id: string, dto: UpdateCareLogDto) {
    const log = await this.prisma.care_logs.findUnique({
      where: { id },
    });

    if (!log) throw new NotFoundException('Care log not found');

    return this.prisma.care_logs.update({
      where: { id },
      data: {
        log_type: dto.log_type,
        notes: dto.notes,
        vitals: dto.vitals as Prisma.InputJsonValue,
        activities: dto.activities as Prisma.InputJsonValue,
        photo_urls: dto.photoUrls,
        data: dto.data as Prisma.InputJsonValue,
      },
      include: {
        caregivers: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.care_logs.findUnique({
      where: { id },
      include: {
        caregivers: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!log) throw new NotFoundException('Care log not found');

    return log;
  }

  async findByJob(jobId: string) {
    const logs = await this.prisma.care_logs.findMany({
      where: { job_id: jobId },
      orderBy: { timestamp: 'desc' },
      include: {
        caregivers: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    return logs;
  }

  async findByCaregiver(caregiverId: string, jobId?: string) {
    const caregiver = await this.prisma.caregivers.findUnique({
      where: { userId: caregiverId },
    });

    if (!caregiver) throw new NotFoundException('Caregiver profile not found');

    const where: Prisma.care_logsWhereInput = { caregiver_id: caregiver.id };
    if (jobId) {
      where.job_id = jobId;
    }

    return this.prisma.care_logs.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      include: {
        caregivers: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });
  }
}
