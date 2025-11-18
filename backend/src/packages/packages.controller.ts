import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PackagesService } from './packages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  async findAll(@Query('active') active?: string) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return await this.packagesService.findAll(isActive);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.packagesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPackageDto: CreatePackageDto, @Req() req: Request) {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    
    // For testing: Allow guardians to create packages by using their user_id as company_id
    // In production, only COMPANY role users should create packages using their company_id
    const companyId = userId;
    
    return await this.packagesService.create(createPackageDto, companyId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return await this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.packagesService.remove(id);
  }
}
