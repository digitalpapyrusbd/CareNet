import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole, PackageCategory } from '@prisma/client';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER)
  create(
    @CurrentUser('company_id') companyId: string,
    @Body() createPackageDto: CreatePackageDto,
  ) {
    return this.packagesService.create(companyId, createPackageDto);
  }

  @Public()
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('category') category?: PackageCategory,
  ) {
    return this.packagesService.findAll(+page, +limit, category);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER)
  update(
    @Param('id') id: string,
    @CurrentUser('company_id') companyId: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packagesService.update(id, companyId, updatePackageDto);
  }

  @Delete(':id')
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER)
  remove(
    @Param('id') id: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.packagesService.remove(id, companyId);
  }
}
