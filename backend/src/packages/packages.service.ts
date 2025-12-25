import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { PackageCategory } from '@prisma/client';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createPackageDto: CreatePackageDto) {
    const pkg = await this.prisma.packages.create({
      data: {
        company_id: companyId,
        agency_id: companyId, // Use the same ID for both fields
        name: createPackageDto.name,
        description: createPackageDto.description,
        category: createPackageDto.category,
        price: createPackageDto.price,
        duration_days: createPackageDto.duration_days,
        hours_per_day: createPackageDto.hours_per_day,
        inclusions: createPackageDto.inclusions,
        exclusions: createPackageDto.exclusions || [],
        caregiver_count: createPackageDto.caregiver_count,
        min_advance_days: createPackageDto.min_advance_days,
      },
    });

    return pkg;
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    category?: PackageCategory,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { is_active: true };

    if (category) {
      where.category = category;
    }

    const [packages, total] = await Promise.all([
      this.prisma.packages.findMany({
        where,
        skip,
        take: limit,
        include: {
          companies: {
            select: {
              company_name: true,
              logo_url: true,
              rating_avg: true,
              is_verified: true,
            },
          },
          agencies: {
            select: {
              agency_name: true,
              logo_url: true,
              rating_avg: true,
              is_verified: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.packages.count({ where }),
    ]);

    return {
      data: packages,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id },
      include: {
        companies: {
          select: {
            id: true,
            company_name: true,
            logo_url: true,
            description: true,
            rating_avg: true,
            rating_count: true,
            is_verified: true,
          },
        },
        agencies: {
          select: {
            id: true,
            agency_name: true,
            logo_url: true,
            description: true,
            rating_avg: true,
            rating_count: true,
            is_verified: true,
          },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    return pkg;
  }

  async update(
    id: string,
    companyId: string,
    updatePackageDto: UpdatePackageDto,
  ) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id },
    });

    if (!pkg || (pkg.company_id !== companyId && pkg.agency_id !== companyId)) {
      throw new NotFoundException('Package not found');
    }

    return this.prisma.packages.update({
      where: { id },
      data: updatePackageDto,
    });
  }

  async remove(id: string, companyId: string) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id },
    });

    if (!pkg || (pkg.company_id !== companyId && pkg.agency_id !== companyId)) {
      throw new NotFoundException('Package not found');
    }

    await this.prisma.packages.update({
      where: { id },
      data: { is_active: false },
    });

    return { message: 'Package deleted successfully' };
  }
}
