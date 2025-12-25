import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import {
  CreateAgencyDto,
  UpdateAgencyDto,
  VerifyAgencyDto,
} from './dto/agency.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @Roles(UserRole.AGENCY)
  create(
    @CurrentUser('id') userId: string,
    @Body() createAgencyDto: CreateAgencyDto,
  ) {
    return this.agenciesService.create(userId, createAgencyDto);
  }

  @Public()
  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
    @Query('isVerified', ParseBoolPipe) isVerified?: boolean,
    @Query('search') search?: string,
  ) {
    return this.agenciesService.findAll(page, limit, isVerified, search);
  }

  @Get('my-agency')
  @Roles(UserRole.AGENCY)
  getMyAgency(@CurrentUser('id') userId: string) {
    return this.agenciesService.findByUserId(userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agenciesService.findOne(id);
  }

  @Patch(':id')
  @Roles(
    UserRole.AGENCY,
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
  )
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    return this.agenciesService.update(id, userId, userRole, updateAgencyDto);
  }

  @Patch(':id/verify')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  verify(@Param('id') id: string, @Body() verifyAgencyDto: VerifyAgencyDto) {
    return this.agenciesService.verify(id, verifyAgencyDto);
  }

  @Public()
  @Get(':id/caregivers')
  getCaregivers(@Param('id') id: string) {
    return this.agenciesService.getCaregivers(id);
  }

  @Public()
  @Get(':id/packages')
  getPackages(@Param('id') id: string) {
    return this.agenciesService.getPackages(id);
  }

  @Get(':id/statistics')
  @Roles(
    UserRole.AGENCY,
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
  )
  getStatistics(@Param('id') id: string) {
    return this.agenciesService.getStatistics(id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(id);
  }
}
