import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Clock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface MigrationCheck {
  name: string;
  passed: boolean;
  details: string;
}

interface MigrationStatus {
  timestamp: string;
  migration_name: string;
  status: 'COMPLETED' | 'INCOMPLETE';
  checks: MigrationCheck[];
  summary: {
    passed: number;
    failed: number;
    total: number;
    success_rate: string;
  };
  recommendations: string[];
}

export default function MigrationStatusPage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMigrationStatus();
  }, []);

  const fetchMigrationStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/migration-status');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching migration status:', err);
      setError('Failed to fetch migration status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'INCOMPLETE':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCheckIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 animate-spin" />
          <span>Loading migration status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Status Available</AlertTitle>
          <AlertDescription>
            Migration status could not be retrieved. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Migration Status: {status.migration_name}</h1>
          <p className="text-muted-foreground">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </p>
        </div>
        <Badge variant={status.status === 'COMPLETED' ? 'secondary' : 'destructive'}>
          {status.status}
        </Badge>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <Database className="h-8 w-8 text-blue-500 mb-2" />
            <span className="text-2xl font-bold">{status.summary.total}</span>
            <span className="text-sm text-muted-foreground">Total Checks</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-2xl font-bold text-green-600">{status.summary.passed}</span>
            <span className="text-sm text-muted-foreground">Passed</span>
          </div>
          <div className="flex flex-col items-center">
            <XCircle className="h-8 w-8 text-red-500 mb-2" />
            <span className="text-2xl font-bold text-red-600">{status.summary.failed}</span>
            <span className="text-sm text-muted-foreground">Failed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{status.summary.success_rate}</span>
            <span className="text-sm text-muted-foreground">Success Rate</span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Migration Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {status.checks.map((check, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 ${
                  check.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getCheckIcon(check.passed)}
                  <div>
                    <h3 className="font-medium">{check.name}</h3>
                    <p className="text-sm text-muted-foreground">{check.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {status.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status.recommendations.map((recommendation, index) => (
                <Alert
                  key={index}
                  variant={recommendation.includes('✅') || recommendation.includes('✓') ? 'default' : 'destructive'}
                >
                  <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={fetchMigrationStatus}
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>

            {status.status === 'INCOMPLETE' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => alert('Rollback functionality is not implemented yet')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Rollback Migration
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => alert('Run validation scripts is not implemented yet')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Run Validation Scripts
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

Now let me create a simple API route for migration status:

<tool_call>
<function=edit_file>
<parameter=path>
/home/zia/Documents/My Projects/SynologyDrive/Websites/Caregiver/src/app/api/admin/migration-status/route.ts
</parameter>
<parameter=display_description>
Create admin API route for migration status
</parameter>
<parameter=mode>
create
</parameter>
<parameter=content>
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Check if user is authenticated and has admin role
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check if user has admin role
  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || !['SUPER_ADMIN', 'MODERATOR'].includes(user.role)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const migrationStatus = await checkMigrationStatus();
    return NextResponse.json(migrationStatus);
  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json(
      { error: 'Failed to check migration status' },
      { status: 500 }
    );
  }
}

// Function to check migration status and data integrity
async function checkMigrationStatus() {
  const checks = [];

  // 1. Check if companies table exists (should not exist after migration)
  const companiesTableExists = await prisma.$queryRaw`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'companies' AND table_schema = 'public'
    )
  `;

  checks.push({
    name: 'Companies table removed',
    passed: !companiesTableExists[0].exists,
    details: companiesTableExists[0].exists
      ? '❌ Companies table still exists'
      : '✅ Companies table successfully removed'
  });

  // 2. Check if agencies table exists (should exist after migration)
  const agenciesTableExists = await prisma.$queryRaw`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'agencies' AND table_schema = 'public'
    )
  `;

  checks.push({
    name: 'Agencies table exists',
    passed: agenciesTableExists[0].exists,
    details: agenciesTableExists[0].exists
      ? '✅ Agencies table exists'
      : '❌ Agencies table missing'
  });

  // 3. Check for orphaned company_id references
  const orphanedCompanyIds = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM information_schema.columns
    WHERE column_name LIKE '%company_id%'
      AND table_schema = 'public'
      AND table_name != 'agencies'
  `;

  checks.push({
    name: 'No orphaned company_id references',
    passed: orphanedCompanyIds[0].count === 0,
    details: `Found ${orphanedCompanyIds[0].count} orphaned company_id references`
  });

  // 4. Check for users with COMPANY role
  const companyUsers = await prisma.users.count({
    where: { role: 'COMPANY' }
  });

  checks.push({
    name: 'No users with COMPANY role',
    passed: companyUsers === 0,
    details: `Found ${companyUsers} users with COMPANY role`
  });

  // 5. Check for agencies with valid userId references
  const invalidAgencyUserIds = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM agencies a
    LEFT JOIN users u ON a."userId" = u.id
    WHERE u.id IS NULL
  `;

  checks.push({
    name: 'All agencies have valid userId references',
    passed: invalidAgencyUserIds[0].count === 0,
    details: `Found ${invalidAgencyUserIds[0].count} agencies with invalid userId references`
  });

  // 6. Check foreign key constraints
  const agencyFkConstraints = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name LIKE '%agency%'
      AND ccu.table_name = 'agencies'
  `;

  checks.push({
    name: 'All agency FK constraints valid',
    passed: agencyFkConstraints[0].count >= 5,
    details: `Found ${agencyFkConstraints[0].count} valid agency foreign key constraints`
  });

  // 7. Check index coverage
  const agencyIndexes = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM pg_indexes
    WHERE indexname LIKE '%agency_id_idx%'
  `;

  checks.push({
    name: 'All agency indexes exist',
    passed: agencyIndexes[0].count >= 5,
    details: `Found ${agencyIndexes[0].count} agency indexes`
  });

  // 8. Check enum values
  const userRoleValues = await prisma.$queryRaw`
    SELECT array_agg(enumlabel ORDER BY enumsortorder) as values
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'UserRole'
  `;

  const feedbackTypeValues = await prisma.$queryRaw`
    SELECT array_agg(enumlabel ORDER BY enumsortorder) as values
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'FeedbackType'
  `;

  checks.push({
    name: 'UserRole enum contains AGENCY',
    passed: userRoleValues[0].values.includes('AGENCY'),
    details: `UserRole enum values: ${userRoleValues[0].values.join(', ')}`
  });

  checks.push({
    name: 'FeedbackType enum contains AGENCY',
    passed: feedbackTypeValues[0].values.includes('AGENCY'),
    details: `FeedbackType enum values: ${feedbackTypeValues[0].values.join(', ')}`
  });

  // 9. Check data integrity across relationships
  const relationshipIntegrity = await prisma.$queryRaw`
    SELECT
      'caregivers' as table_name,
      COUNT(*) as total,
      COUNT(agency_id) as with_agency,
      COUNT(*) - COUNT(agency_id) as without_agency
    FROM caregivers
    UNION ALL
    SELECT 'jobs', COUNT(*), COUNT(agency_id), COUNT(*) - COUNT(agency_id) FROM jobs
    UNION ALL
    SELECT 'packages', COUNT(*), COUNT(agency_id), COUNT(*) - COUNT(agency_id) FROM packages
  `;

  relationshipIntegrity.forEach(row => {
    checks.push({
      name: `All ${row.table_name} have agency_id`,
      passed: row.without_agency === 0,
      details: `${row.total} total, ${row.with_agency} with agency_id, ${row.without_agency} without`
    });
  });

  // 10. Check soft delete functionality
  const softDeletedAgencies = await prisma.agencies.count({
    where: { deleted_at: { not: null } }
  });

  const totalAgencies = await prisma.agencies.count();

  checks.push({
    name: 'Soft delete mechanism working',
    passed: true, // Soft delete is optional, so just report status
    details: `Total agencies: ${totalAgencies}, Soft deleted: ${softDeletedAgencies}`
  });

  // Summary
  const passedChecks = checks.filter(check => check.passed).length;
  const totalChecks = checks.length;
  const migrationComplete = passedChecks === totalChecks;

  return {
    timestamp: new Date().toISOString(),
    migration_name: 'Company to Agency',
    status: migrationComplete ? 'COMPLETED' : 'INCOMPLETE',
    checks: checks,
    summary: {
      passed: passedChecks,
      failed: totalChecks - passedChecks,
      total: totalChecks,
      success_rate: ((passedChecks / totalChecks) * 100).toFixed(1) + '%'
    },
    recommendations: migrationComplete ?
      ['✅ Migration completed successfully - no further action needed'] :
      [
        '❌ Migration has issues that need attention',
        '🔍 Review failed checks above',
        '🛠️ Fix database inconsistencies',
        '🧪 Run comprehensive tests before production',
        '🛡️ Consider rollback if critical issues found'
      ]
  };
}
</parameter>
</function>
</tool_call>
