import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get single caregiver by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:7',message:'GET request received',data:{caregiver_id:params.id,hasAuthHeader:!!request.headers.get('authorization')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY])(request);
  if (authResult) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:12',message:'Authorization failed',data:{status:authResult.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return authResult;
  }

  const user = (request as any).user;
  const caregiverId = (await params).id;

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:22',message:'Starting Prisma query',data:{caregiverId,userRole:user.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    // Build query with includes
    const include: any = {
      users: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
        },
      },
    };

    // Agencies can only see their own caregivers
    if (user.role === UserRole.COMPANY) {
      const agency = await prisma.companies.findFirst({
        where: { user_id: user.id },
      });
      
      if (agency) {
        include.agencies = {
          where: { id: agency.id },
          select: {
            id: true,
            agency_name: true,
          },
        };
      }
    } else {
      // Admin/Moderator can see all agencies
      include.agencies = {
        select: {
          id: true,
          agency_name: true,
        },
      };
    }

    const caregiver = await prisma.caregivers.findFirst({
      where: {
        id: caregiverId,
        deleted_at: null,
        ...(user.role === UserRole.COMPANY ? {
          agency_id: (await prisma.companies.findFirst({
            where: { user_id: user.id },
          }))?.id,
        } : {}),
      },
      include,
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:58',message:'Prisma query completed',data:{found:!!caregiver,caregiverId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!caregiver) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:64',message:'Caregiver not found',data:{caregiverId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Caregiver not found' },
        { status: 404 }
      );
    }

    // Transform data to match frontend interface
    const userData = caregiver.users;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:99',message:'Transforming data',data:{hasUserData:!!userData,caregiver_id:caregiver.id,user_id:caregiver.userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F1'})}).catch(()=>{});
    // #endregion
    
    if (!userData) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:105',message:'User data missing',data:{caregiverId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F2'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'User data not found for caregiver' },
        { status: 404 }
      );
    }
    
    const nameParts = (userData.name || '').split(' ');
    const responseData = {
      id: caregiver.id,
      userId: caregiver.userId,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: userData.email || '',
      phoneNumber: userData.phone || '',
      dateOfBirth: caregiver.date_of_birth?.toISOString().split('T')[0],
      gender: caregiver.gender,
      address: caregiver.address,
      city: caregiver.city,
      state: caregiver.state,
      zipCode: caregiver.zip_code,
      country: caregiver.country,
      bio: caregiver.bio,
      experience: caregiver.experience_years,
      hourlyRate: caregiver.hourly_rate ? parseFloat(caregiver.hourly_rate.toString()) : undefined,
      availability: caregiver.availability,
      languages: caregiver.languages || [],
      skills: caregiver.skills || [],
      certifications: Array.isArray(caregiver.certifications) 
        ? caregiver.certifications.map((c: any) => typeof c === 'string' ? c : (c?.name || String(c))) 
        : (caregiver.certifications ? [String(caregiver.certifications)] : []),
      education: caregiver.education,
      backgroundCheckStatus: caregiver.background_check_status,
      backgroundCheckDate: caregiver.background_check_date?.toISOString(),
      status: caregiver.is_verified ? 'VERIFIED' : 'PENDING',
      verificationStatus: caregiver.is_verified ? 'VERIFIED' : 'PENDING',
      verificationNotes: caregiver.verification_notes,
      profilePicture: caregiver.photo_url,
      rating: caregiver.rating_avg ? parseFloat(caregiver.rating_avg.toString()) : undefined,
      totalReviews: caregiver.rating_count || 0,
      completedJobs: caregiver.total_jobs_completed || 0,
      createdAt: caregiver.created_at.toISOString(),
      updatedAt: caregiver.updated_at.toISOString(),
      agency: Array.isArray(caregiver.agencies) && caregiver.agencies.length > 0 ? {
        id: caregiver.agencies[0].id,
        name: caregiver.agencies[0].agency_name,
      } : (caregiver.agencies && !Array.isArray(caregiver.agencies) ? {
        id: caregiver.agencies.id,
        name: caregiver.agencies.agency_name,
      } : undefined),
    };

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:100',message:'Returning success response',data:{hasData:!!responseData,hasAgency:!!responseData.agency},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/caregivers/[id]/route.ts:108',message:'Error caught',data:{errorName:error?.name,errorMessage:error?.message,errorStack:error?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    console.error('Get caregiver error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

