import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, AssignCaregiverDto } from './dto/job.dto';
import { JobStatus, UserRole, AssignmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(guardianId: string, createJobDto: CreateJobDto) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id: createJobDto.package_id },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    const patient = await this.prisma.patients.findUnique({
      where: { id: createJobDto.patient_id },
    });

    if (!patient || patient.guardian_id !== guardianId) {
      throw new ForbiddenException('Patient not found or not owned by you');
    }

    const job = await this.prisma.jobs.create({
      data: {
        package_id: createJobDto.package_id,
        guardian_id: guardianId,
        patient_id: createJobDto.patient_id,
        agency_id: pkg.agency_id,
        start_date: new Date(createJobDto.start_date),
        end_date: createJobDto.end_date
          ? new Date(createJobDto.end_date)
          : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        special_instructions: createJobDto.special_instructions,
        status: JobStatus.PENDING_ASSIGNMENT,
        total_price: pkg.price,
        commission_amount: Number(pkg.price) * 0.1,
        payout_amount: Number(pkg.price) * 0.9,
      },
    });

    return job;
  }

  async findAll(
    userId: string,
    userRole: UserRole,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.jobsWhereInput = {};

    if (userRole === UserRole.GUARDIAN) {
      where.guardian_id = userId;
    } else if (
      userRole === UserRole.AGENCY_ADMIN ||
      userRole === UserRole.AGENCY_MANAGER
    ) {
      const agency = await this.prisma.agencies.findUnique({
        where: { userId },
      });
      if (agency) where.agency_id = agency.id;
    } else if (userRole === UserRole.CAREGIVER) {
      const caregiver = await this.prisma.caregivers.findUnique({
        where: { userId },
      });
      if (caregiver) {
        where.assignments = {
          some: { caregiver_id: caregiver.id },
        };
      }
    }

    const [jobs, total] = await Promise.all([
      this.prisma.jobs.findMany({
        where,
        skip,
        take: limit,
        include: {
          packages: { select: { name: true } },
          patients: { select: { name: true } },
          assignments: {
            include: {
              caregivers_assignments_caregiver_idTocaregivers: {
                include: {
                  users: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.jobs.count({ where }),
    ]);

    return {
      data: jobs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const job = await this.prisma.jobs.findUnique({
      where: { id },
      include: {
        packages: true,
        patients: true,
        agencies: true,
        assignments: {
          include: {
            caregivers_assignments_caregiver_idTocaregivers: {
              include: {
                users: { select: { name: true, phone: true, id: true } },
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (
      job.guardian_id !== userId &&
      userRole !== UserRole.SUPER_ADMIN &&
      userRole !== UserRole.PLATFORM_ADMIN
    ) {
      const agency = await this.prisma.agencies.findUnique({
        where: { userId },
      });
      if (!agency || agency.id !== job.agency_id) {
        // Also allow caregiver assigned to this job
        const isAssigned = job.assignments?.some(
          (a) =>
            a.caregivers_assignments_caregiver_idTocaregivers?.users?.id ===
            userId,
        );
        if (!isAssigned) {
          throw new ForbiddenException('Access denied');
        }
      }
    }

    return job;
  }

  async update(id: string, userId: string, updateJobDto: UpdateJobDto) {
    const job = await this.prisma.jobs.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.guardian_id !== userId) {
      throw new ForbiddenException('Only the guardian can update this job');
    }

    if (job.status !== JobStatus.PENDING_ASSIGNMENT) {
      throw new BadRequestException('Can only update pending jobs');
    }

    const updatedJob = await this.prisma.jobs.update({
      where: { id },
      data: {
        start_date: updateJobDto.start_date
          ? new Date(updateJobDto.start_date)
          : undefined,
        end_date: updateJobDto.end_date
          ? new Date(updateJobDto.end_date)
          : undefined,
        special_instructions: updateJobDto.special_instructions,
      },
    });

    return updatedJob;
  }

  async assignCaregivers(
    id: string,
    userId: string,
    assignDto: AssignCaregiverDto,
  ) {
    const job = await this.prisma.jobs.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const agency = await this.prisma.agencies.findUnique({
      where: { userId },
    });
    if (!agency || agency.id !== job.agency_id) {
      throw new ForbiddenException('Only the agency can assign caregivers');
    }

    await this.prisma.assignments.deleteMany({ where: { job_id: id } });

    await Promise.all(
      assignDto.caregiver_ids.map((caregiverId) =>
        this.prisma.assignments.create({
          data: {
            job_id: id,
            caregiver_id: caregiverId,
            status: AssignmentStatus.ASSIGNED,
            shift_start_time: '09:00', // Default
            shift_end_time: '17:00', // Default
            days_of_week: ['MON', 'TUE', 'WED', 'THU', 'FRI'], // Default
          },
        }),
      ),
    );

    return { message: 'Caregivers assigned successfully' };
  }

  async acceptJob(id: string, userId: string) {
    const caregiver = await this.prisma.caregivers.findUnique({
      where: { userId },
    });
    if (!caregiver) {
      throw new NotFoundException('Caregiver profile not found');
    }

    const assignment = await this.prisma.assignments.findFirst({
      where: {
        job_id: id,
        caregiver_id: caregiver.id,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Job assignment not found');
    }

    await this.prisma.assignments.update({
      where: { id: assignment.id },
      data: { status: AssignmentStatus.ACTIVE },
    });

    const allAssignments = await this.prisma.assignments.findMany({
      where: { job_id: id },
    });

    const allAccepted = allAssignments.every(
      (a) => a.status === AssignmentStatus.ACTIVE,
    );

    if (allAccepted) {
      await this.prisma.jobs.update({
        where: { id },
        data: { status: JobStatus.ACTIVE },
      });
    }

    return { message: 'Job accepted successfully' };
  }

  async completeJob(id: string, userId: string) {
    const job = await this.prisma.jobs.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.guardian_id !== userId) {
      throw new ForbiddenException('Only the guardian can complete this job');
    }

    const updatedJob = await this.prisma.jobs.update({
      where: { id },
      data: {
        status: JobStatus.COMPLETED,
        // completed_at field doesn't exist in schema
      },
    });

    return updatedJob;
  }

  async cancelJob(id: string, userId: string) {
    const job = await this.prisma.jobs.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.guardian_id !== userId) {
      throw new ForbiddenException('Only the guardian can cancel this job');
    }

    const updatedJob = await this.prisma.jobs.update({
      where: { id },
      data: {
        status: JobStatus.CANCELLED,
        cancelled_at: new Date(),
        cancelled_by: userId,
      },
    });

    return updatedJob;
  }
}
