import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, authorize, getCurrentUser } from '@/lib/middleware/auth';
import { authorizeResource, authorizeOwnResource } from '@/lib/middleware/auth';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { deleteUserSessions } from '@/lib/session';
import { kv } from '@vercel/kv';

// Validation schemas
const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters').optional(),
  email: z.string().email('Valid email is required').optional(),
  language: z.enum(['en', 'bn']).optional(),
  currentPassword: z.string().min(1, 'Current password is required').optional(),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .optional(),
  profileImage: z.string().url('Valid URL is required').optional(),
});

const deactivateUserSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  notifyUser: z.boolean().default(true),
});

const bulkActionSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user ID is required'),
  action: z.enum(['ACTIVATE', 'DEACTIVATE', 'DELETE', 'VERIFY_KYC']),
  reason: z.string().optional(),
});

// GET /api/users - Get users with advanced filtering and search
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role') as UserRole | null;
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const kycStatus = searchParams.get('kycStatus');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
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
    
    if (isActive !== null) {
      where.is_active = isActive === 'true';
    }
    
    if (kycStatus) {
      where.kycStatus = kycStatus;
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
      prisma.users.findMany({
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
                company_name: true,
                trade_license: true,
                is_verified: true,
                rating_avg: true,
                rating_count: true,
                subscription_tier: true,
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
                experience_years: true,
                rating_avg: true,
                rating_count: true,
                is_verified: true,
                isAvailable: true,
                total_jobs_completed: true,
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
                count: true,
              },
            },
          }),
        },
        orderBy,
      }),
      prisma.users.count({ where }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
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
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (admin only)
export async function POST(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN])(request);
  if (authResult) return authResult;
  
  try {
    const body = await request.json();
    const {
      role,
      phone,
      email,
      password,
      name,
      language = 'en',
    } = body;
    
    // Validate required fields
    if (!role || !phone || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: role, phone, password, name' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { phone },
          ...(email && [{ email }]),
        ],
      },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this phone or email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const { hashPassword } = await import('@/lib/auth');
    const passwordHash = await hashPassword(password);
    
    // Create user with role-specific data
    let user;
    
    if (role === UserRole.COMPANY) {
      // Additional company data would be handled separately
      user = await prisma.users.create({
        data: {
          role,
          phone,
          email,
          password_hash: passwordHash,
          name,
          language,
          kyc_status: 'PENDING',
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
    } else {
      user = await prisma.users.create({
        data: {
          role,
          phone,
          email,
          password_hash: passwordHash,
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
    }
    
    // Log user creation
    await prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: user.role,
        action_type: 'USER_CREATED',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user (self or admin)
export async function PUT(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticate(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);
    const { userId } = body;
    
    // Check if user is updating their own profile or is admin
    const isOwnProfile = !userId || userId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.MODERATOR;
    
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only update your own profile' },
        { status: 403 }
      );
    }
    
    const targetUserId = isOwnProfile ? currentUser.id : userId;
    
    // Find user to update
    const user = await prisma.users.findUnique({
      where: { id: targetUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // If updating password, verify current password
    if (validatedData.currentPassword && validatedData.newPassword) {
      const { verifyPassword } = await import('@/lib/auth');
      const isCurrentPasswordValid = await verifyPassword(validatedData.currentPassword, user.passwordHash);
      
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
    }
    
    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.email !== undefined) updateData.email = validatedData.email;
    if (validatedData.language !== undefined) updateData.language = validatedData.language;
    if (validatedData.newPassword !== undefined) {
      const { hashPassword } = await import('@/lib/auth');
      updateData.passwordHash = await hashPassword(validatedData.newPassword);
    }
    
    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: targetUserId },
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
    
    // Log profile update
    await prisma.audit_logs.create({
      data: {
        actor_id: currentUser.id,
        actor_role: currentUser.role,
        action_type: 'USER_UPDATED',
        entity_type: 'USER',
        entity_id: targetUserId,
        changes: {
          old: {
            name: user.name,
            email: user.email,
            language: user.language,
          },
          new: {
            name: validatedData.name,
            email: validatedData.email,
            language: validatedData.language,
          },
        },
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/users - Bulk actions on users (admin only)
export async function PATCH(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;
  
  try {
    const body = await request.json();
    const validatedData = bulkActionSchema.parse(body);
    
    const results = [];
    
    for (const userId of validatedData.userIds) {
      try {
        const user = await prisma.users.findUnique({
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
        
        switch (validatedData.action) {
          case 'ACTIVATE':
            updateData = { isActive: true };
            actionType = 'USER_ACTIVATED';
            break;
            
          case 'DEACTIVATE':
            updateData = { isActive: false };
            actionType = 'USER_DEACTIVATED';
            
            // Logout user from all devices
            await deleteUserSessions(userId);
            break;
            
          case 'VERIFY_KYC':
            updateData = { kycStatus: 'VERIFIED' };
            actionType = 'USER_KYC_VERIFIED';
            break;
            
          case 'DELETE':
            // Soft delete
            updateData = { 
              isActive: false,
              deletedAt: new Date(),
            };
            actionType = 'USER_DELETED';
            
            // Logout user from all devices
            await deleteUserSessions(userId);
            break;
        }
        
        const updatedUser = await prisma.users.update({
          where: { id: userId },
          data: updateData,
        });
        
        // Log action
        await prisma.audit_logs.create({
          data: {
            actor_id: getCurrentUser(request).id,
            actor_role: getCurrentUser(request).role,
            action_type: actionType,
            entity_type: 'USER',
            entity_id: userId,
            changes: {
              action: validatedData.action,
              reason: validatedData.reason,
            },
            ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
            user_agent: request.headers.get('user-agent') || 'Unknown',
          },
        });
        
        results.push({
          userId,
          success: true,
          action: validatedData.action,
          data: updatedUser,
        });
        
        // Send notification if specified
        if (validatedData.action === 'DEACTIVATE' && validatedData.notifyUser) {
          // TODO: Send notification to user
          console.log(`User ${userId} deactivated. Reason: ${validatedData.reason}`);
        }
        
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
        results.push({
          userId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Bulk ${validatedData.action} completed`,
      results,
      summary: {
        total: validatedData.userIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      },
    });
  } catch (error) {
    console.error('Bulk user action error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Deactivate user (admin only)
export async function DELETE(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN])(request);
  if (authResult) return authResult;
  
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const reason = url.searchParams.get('reason') || 'Administrative deactivation';
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Deactivate user
    const deactivatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });
    
    // Logout user from all devices
    await deleteUserSessions(userId);
    
    // Log deactivation
    await prisma.audit_logs.create({
      data: {
        actor_id: getCurrentUser(request).id,
        actor_role: getCurrentUser(request).role,
        action_type: 'USER_DEACTIVATED',
        entity_type: 'USER',
        entity_id: userId,
        changes: {
          reason,
        previousState: user.is_active,
        newState: false,
        },
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });
    
    return NextResponse.json({
      success: true,
      data: deactivatedUser,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}