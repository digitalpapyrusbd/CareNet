import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateAgencyDto,
  UpdateAgencyDto,
  VerifyAgencyDto,
} from './dto/agency.dto';
import { UserRole, Prisma } from '@prisma/client';

@Injectable()
export class AgenciesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new agency
   */
  async create(userId: string, createAgencyDto: CreateAgencyDto) {
    // Check if user already has an agency
    const existingAgency = await this.prisma.agencies.findUnique({
      where: { userId },
    });

    if (existingAgency) {
      throw new BadRequestException('User already has an agency registered');
    }

    // Update user role to AGENCY
    await this.prisma.users.update({
      where: { id: userId },
      data: { role: UserRole.AGENCY },
    });

    const agency = await this.prisma.agencies.create({
      data: {
        userId,
        ...createAgencyDto,
        specializations: createAgencyDto.specializations || [],
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

    return agency;
  }

  /**
   * Get all agencies with filters
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    isVerified?: boolean,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.agenciesWhereInput = { deleted_at: null };

    if (isVerified !== undefined) {
      where.is_verified = isVerified;
    }

    if (search) {
      where.OR = [
        { agency_name: { contains: search } },
        { contact_person: { contains: search } },
      ];
    }

    const [agencies, total] = await Promise.all([
      this.prisma.agencies.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          agency_name: true,
          logo_url: true,
          description: true,
          address: true,
          specializations: true,
          rating_avg: true,
          rating_count: true,
          is_verified: true,
          created_at: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.agencies.count({ where }),
    ]);

    return {
      data: agencies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get agency by ID
   */
  async findOne(id: string) {
    const agency = await this.prisma.agencies.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        service_zones: true,
        _count: {
          select: {
            caregivers: true,
            packages: true,
            jobs: true,
          },
        },
      },
    });

    if (!agency || agency.deleted_at) {
      throw new NotFoundException('Agency not found');
    }

    return agency;
  }

  /**
   * Get agency by user ID
   */
  async findByUserId(userId: string) {
    const agency = await this.prisma.agencies.findUnique({
      where: { userId },
      include: {
        service_zones: true,
        _count: {
          select: {
            caregivers: true,
            packages: true,
            jobs: true,
          },
        },
      },
    });

    if (!agency || agency.deleted_at) {
      throw new NotFoundException('Agency not found');
    }

    return agency;
  }

  /**
   * Update agency
   */
  async update(
    id: string,
    userId: string,
    userRole: UserRole,
    updateAgencyDto: UpdateAgencyDto,
  ) {
    const agency = await this.prisma.agencies.findUnique({
      where: { id },
    });

    if (!agency || agency.deleted_at) {
      throw new NotFoundException('Agency not found');
    }

    // Only agency owner or admin can update
    if (
      agency.userId !== userId &&
      userRole !== UserRole.SUPER_ADMIN &&
      userRole !== UserRole.MODERATOR
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this agency',
      );
    }

    const updatedAgency = await this.prisma.agencies.update({
      where: { id },
      data: updateAgencyDto,
    });

    return updatedAgency;
  }

  /**
   * Verify agency (Admin only)
   */
  async verify(id: string, verifyAgencyDto: VerifyAgencyDto) {
    const agency = await this.prisma.agencies.findUnique({
      where: { id },
    });

    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    const updatedAgency = await this.prisma.agencies.update({
      where: { id },
      data: {
        is_verified: true,
        verification_notes: verifyAgencyDto.verification_notes,
      },
    });

    return updatedAgency;
  }

  /**
   * Get agency caregivers (roster)
   */
  async getCaregivers(id: string) {
    const agency = await this.prisma.agencies.findUnique({
      where: { id },
    });

    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    const caregivers = await this.prisma.caregivers.findMany({
      where: {
        agency_id: id,
        deleted_at: null,
      },
      select: {
        id: true,
        users: {
          select: {
            name: true,
            phone: true,
          },
        },
        photo_url: true,
        skills: true,
        experience_years: true,
        hourly_rate: true,
        rating_avg: true,
        rating_count: true,
        is_available: true,
        is_verified: true,
      },
    });

    return caregivers;
  }

  /**
   * Get agency packages
   */
  async getPackages(id: string) {
    const agency = await this.prisma.agencies.findUnique({
      where: { id },
    });

    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    const packages = await this.prisma.packages.findMany({
      where: {
        agency_id: id,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        duration_days: true,
        hours_per_day: true,
        inclusions: true,
        exclusions: true,
        caregiver_count: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return packages;
  }

  /**
   * Get agency statistics
   */
  async getStatistics(id: string) {
    const [
      totalCaregivers,
      activeCaregivers,
      totalPackages,
      totalJobs,
      completedJobs,
    ] = await Promise.all([
      this.prisma.caregivers.count({
        where: { agency_id: id, deleted_at: null },
      }),
      this.prisma.caregivers.count({
        where: { agency_id: id, is_available: true, deleted_at: null },
      }),
      this.prisma.packages.count({
        where: { agency_id: id, is_active: true },
      }),
      this.prisma.jobs.count({ where: { agency_id: id } }),
      this.prisma.jobs.count({
        where: { agency_id: id, status: 'COMPLETED' },
      }),
    ]);

    return {
      totalCaregivers,
      activeCaregivers,
      totalPackages,
      totalJobs,
      completedJobs,
    };
  }

  /**
   * Soft delete agency
   */
  async remove(id: string) {
    const agency = await this.prisma.agencies.findUnique({
      where: { id },
    });

    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    await this.prisma.agencies.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return { message: 'Agency deleted successfully' };
  }
}
