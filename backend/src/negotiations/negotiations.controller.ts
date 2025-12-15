import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NegotiationsService } from './negotiations.service';
import {
  CreateNegotiationDto,
  RespondNegotiationDto,
} from './dto/negotiation.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('negotiations')
export class NegotiationsController {
  constructor(private readonly negotiationsService: NegotiationsService) {}

  @Post()
  @Roles(UserRole.GUARDIAN)
  create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateNegotiationDto,
  ) {
    return this.negotiationsService.create(userId, createDto);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.negotiationsService.findAll(userId, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.negotiationsService.findOne(id);
  }

  @Patch(':id/respond')
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER, UserRole.GUARDIAN)
  respond(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() respondDto: RespondNegotiationDto,
  ) {
    return this.negotiationsService.respond(id, userId, respondDto);
  }
}
