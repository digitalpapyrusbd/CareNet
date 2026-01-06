import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get migration status (Admin only)
export async function GET(request: NextRequest) {
  // Check authentication
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }

  const user = (request as any).user;

  // Check authorization - only SUPER_ADMIN and MODERATOR can view migration status
  if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.MODERATOR) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  try {
    // Run validation checks
    const checks = [];

    // Check 1: No orphaned company_id references
    const orphanedCompanyRefs = await prisma.$queryRaw`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE column_name LIKE '%company%'
        AND table_schema = 'public'
        AND column_name NOT LIKE '%agency%'
    `;
    checks.push({
      name: 'No orphaned company references',
      status: Array.isArray(orphanedCompanyRefs) && orphanedCompanyRefs.length === 0 ? 'PASS' : 'FAIL',
      count: Array.isArray(orphanedCompanyRefs) ? orphanedCompanyRefs.length : 0
    });

    // Check 2: All agencies have valid userId references
    const invalidAgencies = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM agencies a
      LEFT JOIN users u ON a."userId" = u.id
      WHERE u.id IS NULL
    `;
    const invalidCount = Array.isArray(invalidAgencies) && invalidAgencies.length > 0 
      ? Number((invalidAgencies[0] as any).count) : 0;
    checks.push({
      name: 'All agencies have valid userId references',
      status: invalidCount === 0 ? 'PASS' : 'FAIL',
      count: invalidCount
    });

    // Check 3: Agencies table exists and has data
    const agenciesCount = await prisma.agencies.count();
    checks.push({
      name: 'Agencies table exists',
      status: 'PASS',
      count: agenciesCount
    });

    // Check 4: Agency foreign keys exist
    const agencyIndexes = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM pg_indexes
      WHERE indexname LIKE '%agency%'
    `;
    const indexesCount = Array.isArray(agencyIndexes) && agencyIndexes.length > 0
      ? Number((agencyIndexes[0] as any).count) : 0;
    checks.push({
      name: 'Agency indexes exist',
      status: indexesCount >= 5 ? 'PASS' : 'WARN',
      count: indexesCount
    });

    // Check 5: Agency constraints exist
    const agencyConstraints = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM pg_constraint
      WHERE conname LIKE '%agency%'
    `;
    const constraintsCount = Array.isArray(agencyConstraints) && agencyConstraints.length > 0
      ? Number((agencyConstraints[0] as any).count) : 0;
    checks.push({
      name: 'Agency constraints exist',
      status: constraintsCount >= 5 ? 'PASS' : 'WARN',
      count: constraintsCount
    });

    // Calculate summary
    const passed = checks.filter(c => c.status === 'PASS').length;
    const failed = checks.filter(c => c.status === 'FAIL').length;
    const warnings = checks.filter(c => c.status === 'WARN').length;
    const total = checks.length;
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

    // Determine overall status
    let overallStatus = 'COMPLETED';
    if (failed > 0) {
      overallStatus = 'INCOMPLETE';
    } else if (warnings > 0) {
      overallStatus = 'WARNING';
    }

    return NextResponse.json({
      status: overallStatus,
      summary: {
        passed,
        failed,
        warnings,
        total,
        success_rate: `${successRate}%`
      },
      checks
    });
  } catch (error: any) {
    console.error('Migration status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check migration status',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

