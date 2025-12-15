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
import { CaregiversService } from './caregivers.service';
import { CreateCaregiverDto, UpdateCaregiverDto } from './dto/caregiver.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('caregivers')
export class CaregiversController {
  constructor(private readonly caregiversService: CaregiversService) {}

  @Post()
  @Roles(UserRole.CAREGIVER)
  create(
    @CurrentUser('id') userId: string,
    @Body() createCaregiverDto: CreateCaregiverDto,
  ) {
    return this.caregiversService.create(userId, createCaregiverDto);
  }

  @Public()
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query() filters: any,
  ) {
    return this.caregiversService.findAll(+page, +limit, filters);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caregiversService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.CAREGIVER)
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateCaregiverDto: UpdateCaregiverDto,
  ) {
    return this.caregiversService.update(id, userId, updateCaregiverDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  remove(@Param('id') id: string) {
    return this.caregiversService.remove(id);
  }
}
