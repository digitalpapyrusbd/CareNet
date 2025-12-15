import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  VerifyCompanyDto,
} from './dto/company.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new company (Agency)
   */
  async create(userId: string, createCompanyDto: CreateCompanyDto) {
    // Check if user already has a company
    const existingCompany = await this.prisma.companies.findUnique({
      where: { userId },
    });

    if (existingCompany) {
      throw new BadRequestException('User already has a company registered');
    }

    // Update user role to AGENCY_ADMIN
    await this.prisma.users.update({
      where: { id: userId },
      data: { role: UserRole.AGENCY_ADMIN },
    });

    const company = await this.prisma.companies.create({
      data: {
        userId,
        ...createCompanyDto,
        specializations: createCompanyDto.specializations || [],
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

    return company;
  }

  /**
   * Get all companies with filters
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    isVerified?: boolean,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.companiesWhereInput = { deleted_at: null };

    if (isVerified !== undefined) {
      where.is_verified = isVerified;
    }

    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' } },
        { contact_person: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [companies, total] = await Promise.all([
      this.prisma.companies.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          company_name: true,
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
      this.prisma.companies.count({ where }),
    ]);

    return {
      data: companies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get company by ID
   */
  async findOne(id: string) {
    const company = await this.prisma.companies.findUnique({
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

    if (!company || company.deleted_at) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  /**
   * Get company by user ID
   */
  async findByUserId(userId: string) {
    const company = await this.prisma.companies.findUnique({
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

    if (!company || company.deleted_at) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  /**
   * Update company
   */
  async update(
    id: string,
    userId: string,
    userRole: UserRole,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.prisma.companies.findUnique({
      where: { id },
    });

    if (!company || company.deleted_at) {
      throw new NotFoundException('Company not found');
    }

    // Only company owner or admin can update
    if (
      company.userId !== userId &&
      userRole !== UserRole.SUPER_ADMIN &&
      userRole !== UserRole.PLATFORM_ADMIN
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this company',
      );
    }

    const updatedCompany = await this.prisma.companies.update({
      where: { id },
      data: updateCompanyDto,
    });

    return updatedCompany;
  }

  /**
   * Verify company (Admin only)
   */
  async verify(id: string, verifyCompanyDto: VerifyCompanyDto) {
    const company = await this.prisma.companies.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const updatedCompany = await this.prisma.companies.update({
      where: { id },
      data: {
        is_verified: true,
        verification_notes: verifyCompanyDto.verification_notes,
      },
    });

    return updatedCompany;
  }

  /**
   * Get company caregivers (roster)
   */
  async getCaregivers(id: string) {
    const company = await this.prisma.companies.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const caregivers = await this.prisma.caregivers.findMany({
      where: {
        company_id: id,
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
   * Get company packages
   */
  async getPackages(id: string) {
    const company = await this.prisma.companies.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const packages = await this.prisma.packages.findMany({
      where: {
        company_id: id,
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
   * Get company statistics
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
        where: { company_id: id, deleted_at: null },
      }),
      this.prisma.caregivers.count({
        where: { company_id: id, is_available: true, deleted_at: null },
      }),
      this.prisma.packages.count({
        where: { company_id: id, is_active: true },
      }),
      this.prisma.jobs.count({ where: { company_id: id } }),
      this.prisma.jobs.count({
        where: { company_id: id, status: 'COMPLETED' },
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
   * Soft delete company
   */
  async remove(id: string) {
    const company = await this.prisma.companies.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.prisma.companies.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return { message: 'Company deleted successfully' };
  }
}
