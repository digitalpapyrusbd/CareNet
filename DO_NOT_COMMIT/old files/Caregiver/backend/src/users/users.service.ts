import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
    isActive?: boolean;
    kycStatus?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 10, role, search, isActive, kycStatus, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (isActive !== undefined) {
      where.is_active = isActive;
    }
    
    if (kycStatus) {
      where.kyc_status = kycStatus;
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }
    
    // Build order by clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    // Get users and total count
    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          role: true,
          phone: true,
          email: true,
          name: true,
          language: true,
          kyc_status: true,
          is_active: true,
          last_login_at: true,
          created_at: true,
          updated_at: true,
          // Include role-specific data
          ...(role === 'COMPANY' && {
          company: {
            select: {
              id: true,
              companyName: true,
              bin: true,
              tradeLicense: true,
              isVerified: true,
              ratingAvg: true,
              ratingCount: true,
              subscriptionTier: true,
            },
          },
        }),
          ...(role === 'CAREGIVER' && {
            caregiver: {
              select: {
                id: true,
                nid: true,
                date_of_birth: true,
                gender: true,
                skills: true,
                experienceYears: true,
                ratingAvg: true,
                ratingCount: true,
                isVerified: true,
                isAvailable: true,
                totalJobsCompleted: true,
              },
            },
          }),
          ...(role === 'GUARDIAN' && {
            patients: {
              select: {
                id: true,
                name: true,
                date_of_birth: true,
                gender: true,
              },
            },
          }),
        },
        orderBy,
      }),
      this.prisma.users.count({ where }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        companies: true,
        caregivers: true,
        patients: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(createUserDto: any) {
    const { role, phone, email, password, name, language = 'en' } = createUserDto;
    
    // Check if user already exists
    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [
          { phone },
          ...(email && [{ email }]),
        ],
      },
    });
    
    if (existingUser) {
      throw new ConflictException('User with this phone or email already exists');
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 12);
    
    // Create user with role-specific data
    const user = await this.prisma.users.create({
      data: {
        role,
        phone,
        email,
        password_hash,
        name,
        language,
        kyc_status: role === UserRole.CAREGIVER ? 'PENDING' : 'VERIFIED', // Caregivers need verification
        is_active: true,
      },
      select: {
        id: true,
        role: true,
        phone: true,
        email: true,
        name: true,
        language: true,
        kyc_status: true,
        is_active: true,
        created_at: true,
      },
    });

    // Log user creation
    await this.prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: user.role,
        action_type: 'USER_CREATED',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: 'Unknown', // Will be set in controller
        user_agent: 'Unknown', // Will be set in controller
      },
    });
    
    return user;
  }

  async update(id: string, updateUserDto: any) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // If updating password, verify current password
    if (updateUserDto.currentPassword && updateUserDto.newPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password_hash);
      
      if (!isCurrentPasswordValid) {
        throw new NotFoundException('Current password is incorrect');
      }
    }
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date(),
    };
    
    if (updateUserDto.name !== undefined) updateData.name = updateUserDto.name;
    if (updateUserDto.email !== undefined) updateData.email = updateUserDto.email;
    if (updateUserDto.language !== undefined) updateData.language = updateUserDto.language;
    if (updateUserDto.newPassword !== undefined) {
      updateData.password_hash = await bcrypt.hash(updateUserDto.newPassword, 12);
    }
    
    // Update user
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        role: true,
        phone: true,
        email: true,
        name: true,
        language: true,
        kyc_status: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
    });
    
    return updatedUser;
  }

  async bulkAction(userIds: string[], action: string, data?: any) {
    const results: Array<{ userId: string; success: boolean; action?: string; data?: any; error?: string }> = [];
    
    for (const userId of userIds) {
      try {
        const user = await this.prisma.users.findUnique({
          where: { id: userId },
        });
        
        if (!user) {
          results.push({
            userId,
            success: false,
            error: 'User not found',
          });
          continue;
        }
        
        let updateData: any = {};
        let actionType = '';
        
        switch (action) {
          case 'ACTIVATE':
            updateData = { is_active: true };
            actionType = 'USER_ACTIVATED';
            break;
            
          case 'DEACTIVATE':
            updateData = { is_active: false };
            actionType = 'USER_DEACTIVATED';
            break;
            
          case 'VERIFY_KYC':
            updateData = { kyc_status: 'VERIFIED' };
            actionType = 'USER_KYC_VERIFIED';
            break;
            
          case 'DELETE':
            // Soft delete
            updateData = { 
              is_active: false,
              deletedAt: new Date(),
            };
            actionType = 'USER_DELETED';
            break;
        }
        
        const updatedUser = await this.prisma.users.update({
          where: { id: userId },
          data: updateData,
        });
        
        // Log action
        await this.prisma.audit_logs.create({
          data: {
            actor_id: 'SYSTEM', // Will be set in controller
            actor_role: 'SYSTEM', // Will be set in controller
            action_type: actionType,
            entity_type: 'USER',
            entity_id: userId,
            changes: {
              action,
              reason: data || 'No reason provided',
            },
            ip_address: 'Unknown', // Will be set in controller
            user_agent: 'Unknown', // Will be set in controller
          },
        });
        
        results.push({
          userId,
          success: true,
          action,
          data: updatedUser,
        });
        
      } catch (error) {
        results.push({
          userId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return {
      results,
      summary: {
        total: userIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      },
    };
  }

  async deactivate(id: string, reason: string = 'Administrative deactivation') {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Deactivate user
    const deactivatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });
    
    // Log deactivation
    await this.prisma.audit_logs.create({
      data: {
        actor_id: 'SYSTEM', // Will be set in controller
        actor_role: 'SYSTEM', // Will be set in controller
        action_type: 'USER_DEACTIVATED',
        entity_type: 'USER',
        entity_id: id,
        changes: {
          reason,
          previousState: user.is_active,
          newState: false,
        },
        ip_address: 'Unknown', // Will be set in controller
        user_agent: 'Unknown', // Will be set in controller
      },
    });
    
    return deactivatedUser;
  }

  async logAudit(actorId: string, actorRole: UserRole, actionType: string, entityType: string, entityId: string, changes?: any, ipAddress?: string, userAgent?: string) {
    await this.prisma.audit_logs.create({
      data: {
        actor_id: actorId,
        actor_role: actorRole,
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        changes,
        ip_address: ipAddress || 'Unknown',
        user_agent: userAgent || 'Unknown',
      },
    });
  }
}