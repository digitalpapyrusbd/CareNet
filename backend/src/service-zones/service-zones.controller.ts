import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ServiceZonesService, CreateServiceZoneDto } from './service-zones.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('service-zones')
export class ServiceZonesController {
  constructor(private readonly serviceZonesService: ServiceZonesService) { }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  create(@Body() data: CreateServiceZoneDto) {
    return this.serviceZonesService.create(data);
  }

  @Public()
  @Get()
  findAll() {
    return this.serviceZonesService.findAll();
  }

  @Public()
  @Get('check-coverage')
  checkCoverage(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.serviceZonesService.checkCoverage(
      parseFloat(lat),
      parseFloat(lng),
    );
  }
}
