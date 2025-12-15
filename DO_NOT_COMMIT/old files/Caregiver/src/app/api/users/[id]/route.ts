import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const authResult = await authenticate(request);
  if (authResult) return authResult;

  const { id } = params;
  const user = (request as any).user;

  try {
    // Users can only view their own profile, except admins
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.MODERATOR && user.id !== id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        phone: true,
        email: true,
        name: true,
        language: true,
        kycStatus: true,
        kycDocumentUrl: true,
        mfaEnabled: true,
        lastLoginAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Include role-specific data based on user role
        ...(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MODERATOR ? {
          company: {
            select: {
              id: true,
              companyName: true,
              tradeLicense: true,
              contactPerson: true,
              contactPhone: true,
              address: true,
              isVerified: true,
              ratingAvg: true,
              ratingCount: true,
            },
          },
          caregiver: {
            select: {
              id: true,
              nid: true,
              photoUrl: true,
              dateOfBirth: true,
              gender: true,
              address: true,
              skills: true,
              experienceYears: true,
              ratingAvg: true,
              ratingCount: true,
              totalJobsCompleted: true,
              isAvailable: true,
              isVerified: true,
            },
          },
        } : {}),
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const authResult = await authenticate(request);
  if (authResult) return authResult;

  const { id } = params;
  const user = (request as any).user;

  try {
    // Users can only update their own profile, except admins
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.MODERATOR && user.id !== id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      language,
      isActive,
      kycStatus,
      isVerified,
    } = body;

    // Build update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (language !== undefined) updateData.language = language;
    
    // Only admins can update these fields
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MODERATOR) {
      if (isActive !== undefined) updateData.isActive = isActive;
      if (kycStatus !== undefined) updateData.kycStatus = kycStatus;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        role: true,
        phone: true,
        email: true,
        name: true,
        language: true,
        kycStatus: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN])(request);
  if (authResult) return authResult;

  const { id } = params;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting deletedAt
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}