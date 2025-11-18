import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { is_active: isActive } : {};
    
    const packages = await this.prisma.packages.findMany({
      where,
      include: {
        companies: {
          select: {
            id: true,
            company_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      statusCode: 200,
      message: 'Packages retrieved successfully',
      data: packages,
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
          },
        },
      },
    });

    if (!pkg) {
      return {
        statusCode: 404,
        message: 'Package not found',
        data: null,
      };
    }

    return {
      statusCode: 200,
      message: 'Package retrieved successfully',
      data: pkg,
    };
  }

  async create(createPackageDto: CreatePackageDto, userId: string) {
    // Try to find a company for this user or use any available company
    let companyId = userId;
    
    // Check if this ID exists as a company
    const companyExists = await this.prisma.companies.findUnique({
      where: { id: companyId },
    });

    if (!companyExists) {
      // Find any company in the database (for testing with non-company users)
      const anyCompany = await this.prisma.companies.findFirst();
      if (anyCompany) {
        companyId = anyCompany.id;
      } else {
        return {
          statusCode: 400,
          message: 'No company available to create package',
          data: null,
        };
      }
    }

    const pkg = await this.prisma.packages.create({
      data: {
        company_id: companyId,
        name: createPackageDto.name,
        description: createPackageDto.description,
        category: createPackageDto.category,
        price: createPackageDto.price,
        duration_days: createPackageDto.duration_days,
        hours_per_day: createPackageDto.hours_per_day,
        inclusions: createPackageDto.inclusions,
        exclusions: createPackageDto.exclusions || [],
        caregiver_count: createPackageDto.caregiver_count,
        is_active: createPackageDto.is_active ?? true,
        min_advance_days: createPackageDto.min_advance_days || 1,
      },
      include: {
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
      message: 'Package created successfully',
      data: pkg,
    };
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id },
    });

    if (!pkg) {
      return {
        statusCode: 404,
        message: 'Package not found',
        data: null,
      };
    }

    const updated = await this.prisma.packages.update({
      where: { id },
      data: {
        name: updatePackageDto.name,
        description: updatePackageDto.description,
        category: updatePackageDto.category as any,
        price: updatePackageDto.price,
        duration_days: updatePackageDto.duration_days,
        hours_per_day: updatePackageDto.hours_per_day,
        inclusions: updatePackageDto.inclusions,
        exclusions: updatePackageDto.exclusions,
        caregiver_count: updatePackageDto.caregiver_count,
        is_active: updatePackageDto.is_active,
        min_advance_days: updatePackageDto.min_advance_days,
      },
      include: {
        companies: {
          select: {
            id: true,
            company_name: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: 'Package updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id },
    });

    if (!pkg) {
      return {
        statusCode: 404,
        message: 'Package not found',
        data: null,
      };
    }

    // Soft delete by setting is_active to false
    await this.prisma.packages.update({
      where: { id },
      data: { is_active: false },
    });

    return {
      statusCode: 200,
      message: 'Package deleted successfully',
      data: { id },
    };
  }
}
