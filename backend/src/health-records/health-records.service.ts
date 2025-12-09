import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { HealthRecordType } from '@prisma/client';

@Injectable()
export class HealthRecordsService {
    constructor(private prisma: PrismaService) { }

    async create(patientId: string, data: any) {
        const record = await this.prisma.health_records.create({
            data: {
                patient_id: patientId,
                record_type: data.record_type as HealthRecordType || HealthRecordType.NOTE,
                title: data.title || 'Untitled Record',
                description: data.description,
                file_url: data.file_url, // singular as per schema
                metadata: data.metadata,
            },
        });

        return record;
    }

    async findByPatient(patientId: string) {
        const records = await this.prisma.health_records.findMany({
            where: { patient_id: patientId },
            orderBy: { created_at: 'desc' },
        });

        return records;
    }
}
