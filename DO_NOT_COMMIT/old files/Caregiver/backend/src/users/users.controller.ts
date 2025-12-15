import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch, 
  Delete, 
  Query, 
  Body, 
  Param, 
  UseGuards,
  Request,
  HttpStatus,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, MinLength } from 'class-validator';

class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}

class BulkActionDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsEnum(['ACTIVATE', 'DEACTIVATE', 'DELETE', 'VERIFY_KYC'])
  action: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

class CreateUserDto {
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  language?: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('kycStatus') kycStatus?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '10') || 10;
    
    const result = await this.usersService.findAll({
      page: pageNum,
      limit: limitNum,
      role,
      search,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      kycStatus,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    });

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: {
        applied: {
          role,
          search,
          isActive,
          kycStatus,
          dateFrom,
          dateTo,
          sortBy,
          sortOrder,
        },
        available: {
          roles: Object.values(UserRole),
          kycStatuses: ['PENDING', 'VERIFIED', 'REJECTED'],
          sortOptions: ['createdAt', 'lastLoginAt', 'name', 'ratingAvg'],
        },
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    try {
      const user = await this.usersService.create(createUserDto);
      
      // Log user creation with proper IP and user agent
      await this.usersService.logAudit(user.id, user.role, 'USER_CREATED', 'USER', user.id, req.ip, req.headers['user-agent']);
      
      return {
        success: true,
        data: user,
        message: 'User created successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw {
          status: HttpStatus.CONFLICT,
          message: error.message,
        };
      }
      throw {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    try {
      // Check if user is updating their own profile or is admin
      const currentUser = req.user;
      const isOwnProfile = !userId || userId === currentUser.id;
      const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.MODERATOR;
      
      if (!isOwnProfile && !isAdmin) {
        throw {
          status: HttpStatus.FORBIDDEN,
          message: 'You can only update your own profile',
        };
      }
      
      const targetUserId = isOwnProfile ? currentUser.id : userId;
      const updatedUser = await this.usersService.update(targetUserId, updateUserDto);
      
      // Log profile update
      await this.usersService.logAudit(currentUser.id, currentUser.role, 'USER_UPDATED', 'USER', targetUserId, req.ip, req.headers['user-agent'], JSON.stringify({
        updated: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          language: updateUserDto.language,
        },
      }));
      
      return {
        success: true,
        data: updatedUser,
        message: 'User profile updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: error.message,
        };
      }
      throw {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  async bulkAction(
    @Body() bulkActionDto: BulkActionDto,
    @Request() req: any,
  ) {
    try {
      const results = await this.usersService.bulkAction(bulkActionDto.userIds, bulkActionDto.action, bulkActionDto.reason);
      
      // Log bulk action
      for (const result of results.results) {
        if (result.success) {
          await this.usersService.logAudit(req.user.id, req.user.role, result.action || 'BULK_ACTION', 'USER', result.userId, req.ip, req.headers['user-agent'], JSON.stringify({
            action: bulkActionDto.action,
            reason: bulkActionDto.reason,
          }));
        }
      }
      
      return {
        success: true,
        message: `Bulk ${bulkActionDto.action} completed`,
        results: results.results,
        summary: results.summary,
      };
    } catch (error) {
      throw {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(
    @Param('id') id: string,
    @Body('reason') reason: string | undefined,
    @Request() req?: any,
  ) {
    try {
      const deactivatedUser = await this.usersService.deactivate(id, reason || 'Administrative deactivation');
      
      // Log deactivation
      await this.usersService.logAudit(req?.user?.id, req?.user?.role, 'USER_DEACTIVATED', 'USER', id, req?.ip, req?.headers?.['user-agent'], JSON.stringify({
        reason,
      }));
      
      return {
        success: true,
        data: deactivatedUser,
        message: 'User deactivated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: error.message,
        };
      }
      throw {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }
}