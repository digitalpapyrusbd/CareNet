import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);
  
  try {
    // Get user with role-specific data
    let userData = null;
    
    switch (user.role) {
      case 'COMPANY':
        userData = await prisma.companies.findUnique({
          where: { userId: user.id },
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                is_active: true,
                created_at: true,
              },
            },
          },
        });
        break;
        
      case 'CAREGIVER':
        userData = await prisma.caregivers.findUnique({
          where: { userId: user.id },
          include: { users: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                is_active: true,
                created_at: true,
              },
            },
            companies: {
              select: {
                id: true,
                company_name: true,
                is_verified: true,
              },
            },
          },
        });
        break;
        
      case 'GUARDIAN':
        userData = await prisma.users.findUnique({
          where: { id: user.id },
          include: {
            patients: {
              orderBy: { createdAt: 'desc' },
            },
          },
        });
        break;
        
      case 'PATIENT':
        userData = await prisma.patients.findFirst({
          where: { user_id: user.id },
          include: {
            users: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        });
        break;
        
      default:
        userData = await prisma.users.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            is_active: true,
            kyc_status: true,
            last_login_at: true,
            created_at: true,
          },
        });
    }
    
    return NextResponse.json({
      user: {
        ...user,
        mfaEnabled: user.mfaEnabled || false,
        profileData: userData,
      },
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);
  
  try {
    const body = await request.json();
    const { name, email, language } = body;
    
    // Update user basic info
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(language && { language }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        language: true,
        is_active: true,
        kyc_status: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
    });
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}