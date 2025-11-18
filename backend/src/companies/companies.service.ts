import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  PayoutMethod,
  SubscriptionTier,
  type companies as CompanyEntity,
} from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { VerifyCompanyDto } from './dto/verify-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertProfile(userId: string, dto: CreateCompanyDto) {
    if (!userId) {
      throw new BadRequestException('Missing authenticated user');
    }

    const owner = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!owner) {
      throw new NotFoundException('User not found');
    }

    const timestamp = Date.now();
    const payload = {
      company_name: dto.name,
      trade_license: dto.license_number,
      trade_license_url: 'https://placeholder.caregiver.com/license.pdf',
      tin: `TIN-${timestamp}`,
      contact_person: owner.name,
      contact_phone: dto.contact_phone,
      contact_email:
        dto.contact_email ?? owner.email ?? `company-${timestamp}@example.com`,
      address: dto.address,
      description: dto.description,
      specializations: dto.service_areas ?? [],
      payout_method: PayoutMethod.BKASH,
      payout_account: `BKASH-${timestamp}`,
    };

    const company = await this.prisma.companies.upsert({
      where: { userId },
      update: payload,
      create: {
        ...payload,
        userId,
        subscription_tier: SubscriptionTier.STARTER,
      },
    });

    return {
      statusCode: 201,
      message: 'Company profile saved',
      data: this.transformCompany(company),
    };
  }

  async listCompanies() {
    const companies = await this.prisma.companies.findMany({
      orderBy: { created_at: 'desc' },
    });

    return {
      statusCode: 200,
      message: 'Companies retrieved successfully',
      data: companies.map((company) => this.transformCompany(company)),
    };
  }

  async verifyCompany(id: string, dto: VerifyCompanyDto) {
    const company = await this.prisma.companies.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const isVerified = dto.verification_status === 'VERIFIED';
    const updated = await this.prisma.companies.update({
      where: { id },
      data: {
        is_verified: isVerified,
        verification_notes: dto.verification_notes,
      },
    });

    return {
      statusCode: 200,
      message: 'Company verification updated',
      data: this.transformCompany(updated),
    };
  }

  private transformCompany(entity: CompanyEntity) {
    return {
      id: entity.id,
      name: entity.company_name,
      address: entity.address,
      contact_phone: entity.contact_phone,
      contact_email: entity.contact_email,
      verification_status: entity.is_verified ? 'VERIFIED' : 'PENDING',
      verification_notes: entity.verification_notes,
      is_verified: entity.is_verified,
    };
  }
}
