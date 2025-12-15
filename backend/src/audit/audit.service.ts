import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: string, action: string, details: any) {
    const audit = await this.prisma.audit_logs.create({
      data: {
        actor_id: userId, // actor_id per schema
        action_type: action, // action_type per schema
        entity_type: 'SYSTEM', // Default, logic should enhance this
        entity_id: 'N/A',
        changes: details, // changes per schema
      },
    });

    return audit;
  }

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.audit_logs.findMany({
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' }, // timestamp per schema
      }),
      this.prisma.audit_logs.count(),
    ]);

    return {
      data: logs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
