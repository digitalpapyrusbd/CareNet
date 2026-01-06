import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCaregiverDto, UpdateCaregiverDto } from './dto/caregiver.dto';
import { UserRole, Prisma } from '@prisma/client';

interface CaregiverFilters {
  isVerified?: boolean;
  isAvailable?: boolean;
}

@Injectable()
export class CaregiversService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCaregiverDto: CreateCaregiverDto) {
    const existing = await this.prisma.caregivers.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('Caregiver profile already exists');
    }

    // Update user role
    await this.prisma.users.update({
      where: { id: userId },
      data: { role: UserRole.CAREGIVER },
    });

    const caregiver = await this.prisma.caregivers.create({
      data: {
        userId,
        ...createCaregiverDto,
        date_of_birth: new Date(createCaregiverDto.date_of_birth),
      },
    });

    return caregiver;
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: CaregiverFilters,
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.caregiversWhereInput = { deleted_at: null };

    if (filters?.isVerified !== undefined) {
      where.is_verified = filters.isVerified;
    }
    if (filters?.isAvailable !== undefined) {
      where.is_available = filters.isAvailable;
    }

    const [caregivers, total] = await Promise.all([
      this.prisma.caregivers.findMany({
        where,
        skip,
        take: limit,
        include: {
          users: {
            select: { name: true, phone: true },
          },
        },
      }),
      this.prisma.caregivers.count({ where }),
    ]);

    return {
      data: caregivers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const caregiver = await this.prisma.caregivers.findUnique({
      where: { id },
      include: {
        users: {
          select: { name: true, phone: true, email: true },
        },
      },
    });

    if (!caregiver || caregiver.deleted_at) {
      throw new NotFoundException('Caregiver not found');
    }

    return caregiver;
  }

  async update(
    id: string,
    userId: string,
    updateCaregiverDto: UpdateCaregiverDto,
  ) {
    const caregiver = await this.prisma.caregivers.findUnique({
      where: { id },
    });

    if (!caregiver || caregiver.userId !== userId) {
      throw new NotFoundException('Caregiver not found');
    }

    return this.prisma.caregivers.update({
      where: { id },
      data: updateCaregiverDto,
    });
  }

  async remove(id: string) {
    await this.prisma.caregivers.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return { message: 'Caregiver deleted successfully' };
  }
}
