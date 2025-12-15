import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDisputeDto, ResolveDisputeDto } from './dto/dispute.dto';
import { DisputeStatus, DisputeType } from '@prisma/client';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateDisputeDto) {
    const job = await this.prisma.jobs.findUnique({
      where: { id: createDto.job_id },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Determine 'against' based on who raised it
    // If Guardian raised, against Company (or Caregiver?)
    // Simplified logic:
    let againstId = '';
    if (job.guardian_id === userId) {
      againstId = job.company_id; // Usually dispute against agency
    } else {
      againstId = job.guardian_id;
    }

    const dispute = await this.prisma.disputes.create({
      data: {
        job_id: createDto.job_id,
        raised_by: userId,
        against: againstId, // Required field
        dispute_type: DisputeType.OTHER, // Should be passed in DTO
        description: createDto.description,
        evidence_urls: (createDto.evidence_urls as any) || [],
        status: DisputeStatus.OPEN,
      },
    });

    return dispute;
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [disputes, total] = await Promise.all([
      this.prisma.disputes.findMany({
        skip,
        take: limit,
        // include: {
        //   jobs: {
        //     select: {
        //       id: true,
        //       packages: { select: { name: true } },
        //     },
        //   },
        // },
        orderBy: { createdAt: 'desc' }, // createdAt camelCase
      }),
      this.prisma.disputes.count(),
    ]);

    return {
      data: disputes,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const dispute = await this.prisma.disputes.findUnique({
      where: { id },
      // include: {
      //   jobs: {
      //     include: {
      //       packages: true,
      //       companies: true,
      //     },
      //   },
      // },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    return dispute;
  }

  async resolve(id: string, resolveDto: ResolveDisputeDto) {
    const dispute = await this.prisma.disputes.update({
      where: { id },
      data: {
        status: DisputeStatus.RESOLVED,
        resolution: resolveDto.resolution,
        // resolution_notes: resolveDto.notes, // Field not in schema: 'resolution' string? 'resolution_action'?
        // keeping it simple
        resolved_at: new Date(),
      },
    });

    return dispute;
  }

  async addEvidence(id: string, evidenceUrls: string[]) {
    // Logic to append evidence
    // Since 'evidence_urls' is Json, we need to read and update
    // For now, simpler implementation
    return { message: 'Evidence added (not implemented)' };
  }
}
