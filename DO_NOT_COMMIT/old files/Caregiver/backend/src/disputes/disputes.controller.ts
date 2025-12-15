import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputesController {
  constructor(private disputesService: DisputesService) {}

  @Post()
  async create(@Request() req, @Body() dto: any) {
    return this.disputesService.create(req.user.userId, dto);
  }

  @Get()
  async findAll() {
    return this.disputesService.findAll();
  }
}
