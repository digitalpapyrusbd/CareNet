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
import { CompaniesService } from './companies.service';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  VerifyCompanyDto,
} from './dto/company.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER)
  create(
    @CurrentUser('id') userId: string,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return this.companiesService.create(userId, createCompanyDto);
  }

  @Public()
  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
    @Query('isVerified', ParseBoolPipe) isVerified?: boolean,
    @Query('search') search?: string,
  ) {
    return this.companiesService.findAll(page, limit, isVerified, search);
  }

  @Get('my-company')
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER)
  getMyCompany(@CurrentUser('id') userId: string) {
    return this.companiesService.findByUserId(userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(
    UserRole.AGENCY_ADMIN,
    UserRole.AGENCY_MANAGER,
    UserRole.SUPER_ADMIN,
    UserRole.PLATFORM_ADMIN,
  )
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, userId, userRole, updateCompanyDto);
  }

  @Patch(':id/verify')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.MODERATOR)
  verify(@Param('id') id: string, @Body() verifyCompanyDto: VerifyCompanyDto) {
    return this.companiesService.verify(id, verifyCompanyDto);
  }

  @Public()
  @Get(':id/caregivers')
  getCaregivers(@Param('id') id: string) {
    return this.companiesService.getCaregivers(id);
  }

  @Public()
  @Get(':id/packages')
  getPackages(@Param('id') id: string) {
    return this.companiesService.getPackages(id);
  }

  @Get(':id/statistics')
  @Roles(
    UserRole.AGENCY_ADMIN,
    UserRole.AGENCY_MANAGER,
    UserRole.SUPER_ADMIN,
    UserRole.PLATFORM_ADMIN,
  )
  getStatistics(@Param('id') id: string) {
    return this.companiesService.getStatistics(id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
