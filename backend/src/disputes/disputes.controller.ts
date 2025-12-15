import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto, ResolveDisputeDto } from './dto/dispute.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateDisputeDto,
  ) {
    return this.disputesService.create(userId, createDto);
  }

  @Get()
  @Roles(UserRole.MODERATOR, UserRole.PLATFORM_ADMIN, UserRole.SUPER_ADMIN)
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.disputesService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disputesService.findOne(id);
  }

  @Patch(':id/resolve')
  @Roles(UserRole.MODERATOR, UserRole.PLATFORM_ADMIN, UserRole.SUPER_ADMIN)
  resolve(@Param('id') id: string, @Body() resolveDto: ResolveDisputeDto) {
    return this.disputesService.resolve(id, resolveDto);
  }

  @Post(':id/evidence')
  addEvidence(
    @Param('id') id: string,
    @Body() body: { evidence_urls: string[] },
  ) {
    return this.disputesService.addEvidence(id, body.evidence_urls);
  }
}
