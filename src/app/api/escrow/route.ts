/**
 * Escrow API Routes
 * Handles all escrow operations for secure payment management
 */

import { NextRequest, NextResponse } from 'next/server';
import { escrowService } from '@/lib/escrow-service';
import { z } from 'zod';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

// Validation schemas
const createEscrowSchema = z.object({
  paymentId: z.string(),
  jobId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('BDT'),
  metadata: z.record(z.any()).optional(),
});

const releaseEscrowSchema = z.object({
  escrowId: z.string(),
  reason: z.string(),
  evidence: z.array(z.string()).optional(),
});

const refundEscrowSchema = z.object({
  escrowId: z.string(),
  reason: z.string(),
  evidence: z.array(z.string()).optional(),
});

const disputeEscrowSchema = z.object({
  escrowId: z.string(),
  reason: z.string(),
  description: z.string(),
  evidence: z.array(z.string()).optional(),
});

const getEscrowSchema = z.object({
  escrowId: z.string(),
});

const getUserEscrowSchema = z.object({
  status: z.string().optional(),
});

/**
 * GET /api/escrow
 * Get escrow transactions for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const escrowId = searchParams.get('escrowId');
    const status = searchParams.get('status');

    if (escrowId) {
      // Get specific escrow transaction
      const escrow = await escrowService.getEscrowTransaction(escrowId);
      
      if (!escrow) {
        return NextResponse.json(
          { error: 'Escrow transaction not found' },
          { status: 404 }
        );
      }

      // Check if user has permission to view this escrow
      const hasPermission = await checkEscrowPermission(session.user.id, session.user.role, escrow);
      
      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: escrow,
      });
    } else {
      // Get user's escrow transactions
      const userEscrows = await escrowService.getUserEscrowTransactions(
        session.user.id,
        session.user.role as 'GUARDIAN' | 'CAREGIVER' | 'COMPANY',
        status || undefined
      );

      return NextResponse.json({
        success: true,
        data: userEscrows,
      });
    }
  } catch (error) {
    console.error('Escrow GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/escrow
 * Create escrow transaction or perform escrow operations
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create':
        return handleCreateEscrow(body, session);
      case 'release':
        return handleReleaseEscrow(body, session);
      case 'refund':
        return handleRefundEscrow(body, session);
      case 'dispute':
        return handleCreateDispute(body, session);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Escrow POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle escrow creation
 */
async function handleCreateEscrow(body: any, session: any) {
  try {
    const validatedData = createEscrowSchema.parse(body);
    
    // Check permissions for creating escrow
    const hasPermission = await checkCreateEscrowPermission(session.user.id, session.user.role, validatedData);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const escrow = await escrowService.createEscrow(validatedData);

    return NextResponse.json({
      success: true,
      data: escrow,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create escrow error:', error);
    return NextResponse.json(
      { error: 'Failed to create escrow' },
      { status: 500 }
    );
  }
}

/**
 * Handle escrow release
 */
async function handleReleaseEscrow(body: any, session: any) {
  try {
    const validatedData = releaseEscrowSchema.parse(body);
    
    // Check permissions for releasing escrow
    const hasPermission = await checkReleaseEscrowPermission(session.user.id, session.user.role, validatedData.escrowId);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const escrow = await escrowService.releaseEscrow({
      escrowId: validatedData.escrowId,
      reason: validatedData.reason,
      releasedBy: session.user.id,
      evidence: validatedData.evidence,
    });

    return NextResponse.json({
      success: true,
      data: escrow,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Release escrow error:', error);
    return NextResponse.json(
      { error: 'Failed to release escrow' },
      { status: 500 }
    );
  }
}

/**
 * Handle escrow refund
 */
async function handleRefundEscrow(body: any, session: any) {
  try {
    const validatedData = refundEscrowSchema.parse(body);
    
    // Check permissions for refunding escrow
    const hasPermission = await checkRefundEscrowPermission(session.user.id, session.user.role, validatedData.escrowId);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const escrow = await escrowService.refundEscrow({
      escrowId: validatedData.escrowId,
      reason: validatedData.reason,
      refundedBy: session.user.id,
      evidence: validatedData.evidence,
    });

    return NextResponse.json({
      success: true,
      data: escrow,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Refund escrow error:', error);
    return NextResponse.json(
      { error: 'Failed to refund escrow' },
      { status: 500 }
    );
  }
}

/**
 * Handle dispute creation
 */
async function handleCreateDispute(body: any, session: any) {
  try {
    const validatedData = disputeEscrowSchema.parse(body);
    
    // Check permissions for creating dispute
    const hasPermission = await checkDisputeEscrowPermission(session.user.id, session.user.role, validatedData.escrowId);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const escrow = await escrowService.createDispute({
      escrowId: validatedData.escrowId,
      reason: validatedData.reason,
      description: validatedData.description,
      disputedBy: session.user.id,
      evidence: validatedData.evidence,
    });

    return NextResponse.json({
      success: true,
      data: escrow,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create dispute error:', error);
    return NextResponse.json(
      { error: 'Failed to create dispute' },
      { status: 500 }
    );
  }
}

/**
 * Check if user has permission to view escrow
 */
async function checkEscrowPermission(userId: string, userRole: string, escrow: any): Promise<boolean> {
  // Super admin can view all escrows
  if (userRole === 'SUPER_ADMIN') {
    return true;
  }

  // Moderator can view all escrows
  if (userRole === 'MODERATOR') {
    return true;
  }

  // Guardian can view escrows for their jobs
  if (userRole === 'GUARDIAN' && escrow.job?.guardianId === userId) {
    return true;
  }

  // Caregiver can view escrows for their assigned jobs
  if (userRole === 'CAREGIVER' && escrow.job?.caregiverId === userId) {
    return true;
  }

  // Company can view escrows for their jobs
  if (userRole === 'COMPANY' && escrow.job?.companyId === userId) {
    return true;
  }

  return false;
}

/**
 * Check if user has permission to create escrow
 */
async function checkCreateEscrowPermission(userId: string, userRole: string, escrowData: any): Promise<boolean> {
  // Only moderators and super admins can create escrows manually
  // (Escrows are typically created automatically when payments are completed)
  return userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
}

/**
 * Check if user has permission to release escrow
 */
async function checkReleaseEscrowPermission(userId: string, userRole: string, escrowId: string): Promise<boolean> {
  // Moderators and super admins can release escrows
  if (userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN') {
    return true;
  }

  // Get escrow details to check ownership
  const escrow = await escrowService.getEscrowTransaction(escrowId);
  
  if (!escrow) {
    return false;
  }

  // Guardians can release escrows for their jobs
  if (userRole === 'GUARDIAN' && escrow.job?.guardianId === userId) {
    return true;
  }

  // Companies can release escrows for their jobs
  if (userRole === 'COMPANY' && escrow.job?.companyId === userId) {
    return true;
  }

  return false;
}

/**
 * Check if user has permission to refund escrow
 */
async function checkRefundEscrowPermission(userId: string, userRole: string, escrowId: string): Promise<boolean> {
  // Only moderators and super admins can refund escrows
  return userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
}

/**
 * Check if user has permission to create dispute
 */
async function checkDisputeEscrowPermission(userId: string, userRole: string, escrowId: string): Promise<boolean> {
  // Get escrow details to check ownership
  const escrow = await escrowService.getEscrowTransaction(escrowId);
  
  if (!escrow) {
    return false;
  }

  // Guardians can create disputes for their jobs
  if (userRole === 'GUARDIAN' && escrow.job?.guardianId === userId) {
    return true;
  }

  // Caregivers can create disputes for their assigned jobs
  if (userRole === 'CAREGIVER' && escrow.job?.caregiverId === userId) {
    return true;
  }

  // Companies can create disputes for their jobs
  if (userRole === 'COMPANY' && escrow.job?.companyId === userId) {
    return true;
  }

  // Moderators and super admins can create disputes
  if (userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN') {
    return true;
  }

  return false;
}