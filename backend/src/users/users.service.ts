import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  UpdateUserDto,
  UpdateUserStatusDto,
  ChangeRoleDto,
} from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all users (Admin only)
   */
  async findAll(page: number = 1, limit: number = 20, role?: UserRole) {
    const skip = (page - 1) * limit;

    const where = role ? { role, deleted_at: null } : { deleted_at: null };

    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          phone: true,
          email: true,
          name: true,
          role: true,
          kyc_status: true,
          is_active: true,
          last_login_at: true,
          created_at: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async findOne(
    id: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        language: true,
        kyc_status: true,
        kyc_document_url: true,
        mfa_enabled: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Users can only view their own profile unless they're admin
    if (
      id !== requestingUserId &&
      requestingUserRole !== UserRole.SUPER_ADMIN &&
      requestingUserRole !== UserRole.PLATFORM_ADMIN
    ) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return user;
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        language: true,
        kyc_status: true,
        kyc_document_url: true,
        mfa_enabled: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ) {
    // Users can only update their own profile unless they're admin
    if (
      id !== requestingUserId &&
      requestingUserRole !== UserRole.SUPER_ADMIN &&
      requestingUserRole !== UserRole.PLATFORM_ADMIN
    ) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        language: true,
        kyc_status: true,
        is_active: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  /**
   * Update user status (Admin only)
   */
  async updateStatus(id: string, updateStatusDto: UpdateUserStatusDto) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: { is_active: updateStatusDto.is_active },
      select: {
        id: true,
        phone: true,
        name: true,
        is_active: true,
      },
    });

    return updatedUser;
  }

  /**
   * Change user role (Super Admin only)
   */
  async changeRole(id: string, changeRoleDto: ChangeRoleDto) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: { role: changeRoleDto.role },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
      },
    });

    return updatedUser;
  }

  /**
   * Soft delete user (Admin only)
   */
  async remove(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.users.update({
      where: { id },
      data: { deleted_at: new Date(), is_active: false },
    });

    return { message: 'User deleted successfully' };
  }

  /**
   * Get user statistics (Admin only)
   */
  async getStatistics() {
    const [totalUsers, activeUsers, verifiedUsers, usersByRole] =
      await Promise.all([
        this.prisma.users.count({ where: { deleted_at: null } }),
        this.prisma.users.count({
          where: { is_active: true, deleted_at: null },
        }),
        this.prisma.users.count({
          where: { kyc_status: 'VERIFIED', deleted_at: null },
        }),
        this.prisma.users.groupBy({
          by: ['role'],
          where: { deleted_at: null },
          _count: true,
        }),
      ]);

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      usersByRole: usersByRole.map((item) => ({
        role: item.role,
        count: item._count,
      })),
    };
  }
}
