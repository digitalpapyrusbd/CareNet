import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateNegotiationDto,
  RespondNegotiationDto,
} from './dto/negotiation.dto';
import { NegotiationStatus } from '@prisma/client';

@Injectable()
export class NegotiationsService {
  constructor(private prisma: PrismaService) {}

  async create(guardianId: string, createDto: CreateNegotiationDto) {
    const pkg = await this.prisma.packages.findUnique({
      where: { id: createDto.package_id },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    // Check existing negotiation
    const existing = await this.prisma.package_negotiations.findFirst({
      where: {
        package_id: createDto.package_id,
        guardian_id: guardianId,
        status: { notIn: ['ACCEPTED', 'DECLINED'] }, // Use string literals or enum
      },
    });

    if (existing) {
      throw new BadRequestException('Active negotiation already exists');
    }

    const negotiation = await this.prisma.package_negotiations.create({
      data: {
        package_id: createDto.package_id,
        guardian_id: guardianId,
        original_price: pkg.price,
        proposed_price: createDto.proposed_price,
        guardian_message: createDto.notes,
        status: NegotiationStatus.PENDING_AGENCY_RESPONSE,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h expiry
      },
    });

    return negotiation;
  }

  async findOne(id: string) {
    const negotiation = await this.prisma.package_negotiations.findUnique({
      where: { id },
      include: {
        guardian: { select: { name: true } },
        // package relation is optional/missing in schema??
        // Let's check schema. model package_negotiations { ... package_id ... guardian ... }
        // There is NO relation to packages defined in 'package_negotiations' model in the schema file view!
        // Line 423.
        // So I can't include packages.
      },
    });

    if (!negotiation) {
      throw new NotFoundException('Negotiation not found');
    }

    return negotiation;
  }

  async respond(id: string, userId: string, respondDto: RespondNegotiationDto) {
    const negotiation = await this.prisma.package_negotiations.findUnique({
      where: { id },
    });

    if (!negotiation) {
      throw new NotFoundException('Negotiation not found');
    }

    // Simplified logic
    let newStatus = negotiation.status;
    if (respondDto.action === 'ACCEPT') {
      newStatus = NegotiationStatus.ACCEPTED;
    } else if (respondDto.action === 'DECLINE') {
      newStatus = NegotiationStatus.DECLINED;
    } else if (respondDto.action === 'COUNTER') {
      newStatus = NegotiationStatus.COUNTER_OFFERED; // or PENDING_GUARDIAN_DECISION
    }

    const updated = await this.prisma.package_negotiations.update({
      where: { id },
      data: {
        status: newStatus,
        agency_response: respondDto.notes,
        counter_price: respondDto.counter_price,
      },
    });

    return updated;
  }

  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [negotiations, total] = await Promise.all([
      this.prisma.package_negotiations.findMany({
        where: { guardian_id: userId },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.package_negotiations.count({
        where: { guardian_id: userId },
      }),
    ]);

    return {
      data: negotiations,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
