import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('audit')
@Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.auditService.findAll(query.page, query.limit);
    }
}
