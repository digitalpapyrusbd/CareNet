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

  async create(agencyId: string, createPackageDto: CreatePackageDto) {
    const pkg = await this.prisma.packages.create({
      data: {
        agency_id: agencyId,
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
    agencyId: string,
    updatePackageDto: UpdatePackageDto,
  ) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id },
    });

    if (!pkg || pkg.agency_id !== agencyId) {
      throw new NotFoundException('Package not found');
    }

    return this.prisma.packages.update({
      where: { id },
      data: updatePackageDto,
    });
  }

  async remove(id: string, agencyId: string) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id },
    });

    if (!pkg || pkg.agency_id !== agencyId) {
      throw new NotFoundException('Package not found');
    }

    await this.prisma.packages.update({
      where: { id },
      data: { is_active: false },
    });

    return { message: 'Package deleted successfully' };
  }
}
