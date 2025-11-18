import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BackgroundCheckStatus,
  Gender,
  KYCStatus,
  Prisma,
  UserRole,
  type caregivers as CaregiverEntity,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { VerifyCaregiverDto } from './dto/verify-caregiver.dto';

type AuthUserPayload = {
  userId?: string;
  id?: string;
  role?: string;
};

type CaregiverProfilePayload = Omit<
  Prisma.caregiversUncheckedCreateInput,
  'userId'
>;

@Injectable()
export class CaregiversService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(currentUser: AuthUserPayload, dto: CreateCaregiverDto) {
    const resolvedUserId = currentUser?.userId ?? currentUser?.id;
    if (!resolvedUserId) {
      throw new BadRequestException('Unable to determine authenticated user');
    }

    let caregiverUserId = resolvedUserId;
    const actorRole = (currentUser.role as UserRole) ?? UserRole.CAREGIVER;

    if (actorRole === UserRole.COMPANY && dto.user_id) {
      caregiverUserId = await this.ensureCaregiverUser(dto.user_id, dto);
    }

    const caregiverUser = await this.prisma.users.findUnique({
      where: { id: caregiverUserId },
    });
    if (!caregiverUser) {
      throw new NotFoundException('Caregiver user not found');
    }

    if (caregiverUser.role !== UserRole.CAREGIVER) {
      await this.prisma.users.update({
        where: { id: caregiverUserId },
        data: { role: UserRole.CAREGIVER },
      });
    }

    const companyId =
      actorRole === UserRole.COMPANY
        ? await this.resolveCompanyId(resolvedUserId)
        : null;

    const caregiver = await this.prisma.caregivers.upsert({
      where: { userId: caregiverUserId },
      update: this.buildCaregiverPayload(dto, companyId ?? undefined),
      create: {
        ...this.buildCaregiverPayload(dto, companyId ?? undefined),
        userId: caregiverUserId,
        company_id: companyId ?? undefined,
      },
    });

    return {
      statusCode: 201,
      message: 'Caregiver profile saved',
      data: this.transformCaregiver(caregiver),
    };
  }

  async verifyCaregiver(id: string, dto: VerifyCaregiverDto) {
    const caregiver = await this.prisma.caregivers.findUnique({
      where: { id },
    });
    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }

    const isVerified = dto.verification_status === 'VERIFIED';
    const updated = await this.prisma.caregivers.update({
      where: { id },
      data: {
        is_verified: isVerified,
        background_check_status: isVerified
          ? BackgroundCheckStatus.CLEARED
          : BackgroundCheckStatus.PENDING,
      },
    });

    return {
      statusCode: 200,
      message: 'Caregiver verification updated',
      data: this.transformCaregiver(updated),
    };
  }

  private buildCaregiverPayload(
    dto: CreateCaregiverDto,
    companyId?: string,
  ): CaregiverProfilePayload {
    const timestamp = Date.now();
    const dob = dto.date_of_birth
      ? new Date(dto.date_of_birth)
      : new Date('1990-01-01');
    const mergedSkills = Array.from(
      new Set([
        ...(dto.qualifications ?? ['general_care']),
        ...(dto.preferred_service_areas ?? []),
      ]),
    );

    return {
      company_id: companyId,
      nid: `TEMP-NID-${timestamp}`,
      nid_url: 'https://placehold.co/600x800?text=NID',
      photo_url: 'https://placehold.co/400x400?text=Caregiver',
      date_of_birth: dob,
      gender: (dto.gender as Gender) || Gender.OTHER,
      address: dto.address || dto.bio || 'Not provided',
      location_lat: dto.location?.latitude ?? null,
      location_lng: dto.location?.longitude ?? null,
      skills: mergedSkills,
      certifications: dto.qualifications ?? [],
      experience_years: dto.experience_years ?? 0,
      languages: ['bn', 'en'],
      availabilityCalendar: dto.availability ?? Prisma.JsonNull,
      hourly_rate: dto.hourly_rate ? new Prisma.Decimal(dto.hourly_rate) : null,
      background_check_status: BackgroundCheckStatus.PENDING,
      is_available: true,
      is_verified: false,
    };
  }

  private transformCaregiver(entity: CaregiverEntity) {
    return {
      id: entity.id,
      user_id: entity.userId,
      company_id: entity.company_id,
      experience_years: entity.experience_years,
      hourly_rate: entity.hourly_rate ? Number(entity.hourly_rate) : null,
      preferred_service_areas: (entity.skills as string[]) ?? [],
      availability:
        (entity.availabilityCalendar as Record<string, boolean>) ?? {},
      verification_status: entity.is_verified ? 'VERIFIED' : 'PENDING',
    };
  }

  private async ensureCaregiverUser(
    userId: string,
    dto: CreateCaregiverDto,
  ): Promise<string> {
    const existing = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (existing) {
      return existing.id;
    }

    const timestamp = Date.now();
    const phone = `+88016${(timestamp % 10000000).toString().padStart(7, '0')}`;
    const tempPassword = await bcrypt.hash(`TempCare${timestamp}!`, 10);

    const created = await this.prisma.users.create({
      data: {
        id: userId,
        role: UserRole.CAREGIVER,
        phone,
        email: `caregiver-${timestamp}@example.com`,
        password_hash: tempPassword,
        name: dto.bio
          ? dto.bio.split(' ')[0] || 'Company Caregiver'
          : 'Company Caregiver',
        kyc_status: KYCStatus.PENDING,
        is_active: true,
      },
    });

    return created.id;
  }

  private async resolveCompanyId(userId: string | undefined | null) {
    if (!userId) {
      return null;
    }

    const company = await this.prisma.companies.findFirst({
      where: { userId },
    });
    return company?.id ?? null;
  }
}
