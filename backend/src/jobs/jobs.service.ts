import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { JobStatus, AssignmentRole, AssignmentStatus } from '@prisma/client';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const jobs = await this.prisma.jobs.findMany({
      include: {
        patients: {
          select: {
            id: true,
            name: true,
          },
        },
        companies: {
          select: {
            id: true,
            company_name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      statusCode: 200,
      message: 'Jobs retrieved successfully',
      data: jobs,
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.jobs.findUnique({
      where: { id },
      include: {
        patients: {
          select: {
            id: true,
            name: true,
          },
        },
        companies: {
          select: {
            id: true,
            company_name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    if (!job) {
      return {
        statusCode: 404,
        message: 'Job not found',
        data: null,
      };
    }

    return {
      statusCode: 200,
      message: 'Job retrieved successfully',
      data: job,
    };
  }

  async create(createJobDto: CreateJobDto, userId: string) {
    // Get the package to calculate pricing
    const pkg = await this.prisma.packages.findUnique({
      where: { id: createJobDto.package_id },
    });

    if (!pkg) {
      return {
        statusCode: 404,
        message: 'Package not found',
        data: null,
      };
    }

    // Get the package's company to assign the job
    const company = await this.prisma.companies.findUnique({
      where: { id: pkg.company_id },
    });

    if (!company) {
      return {
        statusCode: 404,
        message: 'Company not found for this package',
        data: null,
      };
    }

    // Calculate total price based on package
    const packagePrice = Number(pkg.price.toString());
    let total_price = packagePrice;
    if (createJobDto.total_price !== undefined) {
      total_price = createJobDto.total_price;
    }
    const commission_amount = total_price * 0.15; // 15% commission
    const payout_amount = total_price - commission_amount;

    const job = await this.prisma.jobs.create({
      data: {
        package_id: createJobDto.package_id,
        patient_id: createJobDto.patient_id,
        company_id: company.id,
        guardian_id: userId,
        start_date: new Date(createJobDto.start_date),
        end_date: new Date(createJobDto.end_date),
        status: JobStatus.PENDING_ASSIGNMENT,
        total_price: total_price,
        commission_amount: commission_amount,
        payout_amount: payout_amount,
        special_instructions: createJobDto.special_instructions || null,
      },
      include: {
        patients: {
          select: {
            id: true,
            name: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        companies: {
          select: {
            id: true,
            company_name: true,
          },
        },
      },
    });

    return {
      statusCode: 201,
      message: 'Job created successfully',
      data: job,
    };
  }

  async update(id: string, updateJobDto: any) {
    const job = await this.prisma.jobs.update({
      where: { id },
      data: {
        status: updateJobDto.status,
        completion_notes: updateJobDto.completion_notes,
        cancelled_reason: updateJobDto.cancelled_reason,
        cancelled_at: updateJobDto.cancelled_at ? new Date(updateJobDto.cancelled_at) : null,
        cancelled_by: updateJobDto.cancelled_by,
      },
      include: {
        patients: {
          select: {
            id: true,
            name: true,
          },
        },
        companies: {
          select: {
            id: true,
            company_name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: 'Job updated successfully',
      data: job,
    };
  }

  async remove(id: string) {
    const job = await this.prisma.jobs.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      message: 'Job deleted successfully',
      data: job,
    };
  }

  async assignCaregiver(
    jobId: string,
    caregiverId: string,
    role: AssignmentRole = AssignmentRole.PRIMARY,
    shiftStart?: string,
    shiftEnd?: string,
    daysOfWeek?: string[],
  ) {
    // First check if job exists and is in PENDING_ASSIGNMENT status
    const job = await this.prisma.jobs.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return {
        statusCode: 404,
        message: 'Job not found',
        data: null,
      };
    }

    if (job.status !== JobStatus.PENDING_ASSIGNMENT) {
      return {
        statusCode: 400,
        message: 'Job is not in pending assignment status',
        data: null,
      };
    }

    // Create assignment
    const assignment = await this.prisma.assignments.create({
      data: {
        job_id: jobId,
        caregiver_id: caregiverId,
        role,
        shift_start_time: shiftStart ?? '09:00',
        shift_end_time: shiftEnd ?? '17:00',
        days_of_week: daysOfWeek ?? [],
        status: AssignmentStatus.ASSIGNED,
      },
    });

    // Update job status to ACTIVE
    await this.prisma.jobs.update({
      where: { id: jobId },
      data: {
        status: JobStatus.ACTIVE,
      },
    });

    return {
      statusCode: 201,
      message: 'Caregiver assigned successfully',
      data: assignment,
    };
  }

  async completeJob(jobId: string, completionNotes?: string) {
    const job = await this.prisma.jobs.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return {
        statusCode: 404,
        message: 'Job not found',
        data: null,
      };
    }

    // Update job status to COMPLETED
    const updatedJob = await this.prisma.jobs.update({
      where: { id: jobId },
      data: {
        status: JobStatus.COMPLETED,
        completion_notes: completionNotes,
      },
    });

    // Update assignment status to COMPLETED
    await this.prisma.assignments.updateMany({
      where: {
        job_id: jobId,
        status: 'ACTIVE',
      },
      data: {
        status: 'COMPLETED',
      },
    });

    return {
      statusCode: 200,
      message: 'Job completed successfully',
      data: updatedJob,
    };
  }

  async cancelJob(jobId: string, reason: string, cancelledBy: string) {
    const job = await this.prisma.jobs.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return {
        statusCode: 404,
        message: 'Job not found',
        data: null,
      };
    }

    // Update job status to CANCELLED
    const updatedJob = await this.prisma.jobs.update({
      where: { id: jobId },
      data: {
        status: JobStatus.CANCELLED,
        cancelled_reason: reason,
        cancelled_at: new Date(),
        cancelled_by: cancelledBy,
      },
    });

    // Update assignment status to REPLACED
    await this.prisma.assignments.updateMany({
      where: {
        job_id: jobId,
        status: 'ACTIVE',
      },
      data: {
        status: 'REPLACED',
        replacement_reason: reason,
      },
    });

    return {
      statusCode: 200,
      message: 'Job cancelled successfully',
      data: updatedJob,
    };
  }
}
