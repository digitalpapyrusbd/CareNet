import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { VerifyCompanyDto } from './dto/verify-company.dto';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateCompanyDto) {
    const userId = req.user?.userId || req.user?.id;
    return this.companiesService.upsertProfile(userId, dto);
  }

  @Get()
  async list() {
    return this.companiesService.listCompanies();
  }

  @Patch(':id/verify')
  async verify(@Param('id') id: string, @Body() dto: VerifyCompanyDto) {
    return this.companiesService.verifyCompany(id, dto);
  }
}
