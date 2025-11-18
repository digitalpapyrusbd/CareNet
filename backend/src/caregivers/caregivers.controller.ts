import { Body, Controller, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CaregiversService } from './caregivers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { VerifyCaregiverDto } from './dto/verify-caregiver.dto';

@Controller('caregivers')
@UseGuards(JwtAuthGuard)
export class CaregiversController {
  constructor(private readonly caregiversService: CaregiversService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateCaregiverDto) {
    const user = req.user ?? {};
    return this.caregiversService.createProfile(user, dto);
  }

  @Patch(':id/verify')
  async verify(
    @Param('id') id: string,
    @Body() dto: VerifyCaregiverDto,
  ) {
    return this.caregiversService.verifyCaregiver(id, dto);
  }
}
