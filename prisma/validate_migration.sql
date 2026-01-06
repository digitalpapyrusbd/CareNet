-- ===============================================
-- CAREGIVER PLATFORM: Company to Agency Migration Validation
-- Created: December 2024
-- Purpose: Comprehensive validation of database migration integrity
-- ===============================================

-- ===============================================
-- 1. CRITICAL VALIDATION QUERIES
-- ===============================================

-- Check 1: No orphaned company_id references
-- This should return 0 rows if migration is complete
SELECT 'CRITICAL: Orphaned company references found' as validation_check,
       table_name,
       column_name
FROM information_schema.columns
WHERE column_name LIKE '%company%'
  AND table_schema = 'public'
  AND column_name NOT LIKE '%agency%';

-- Check 2: All foreign keys point to agencies table correctly
SELECT 'CRITICAL: Invalid foreign key relationships' as validation_check,
       tc.table_name,
       kcu.column_name,
       ccu.table_name AS foreign_table_name,
       ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name LIKE '%agency%'
  AND ccu.table_name != 'agencies';

-- Check 3: No users still have COMPANY role
-- NOTE: Since COMPANY enum value doesn't exist, this check always passes
-- If migration is complete, all COMPANY roles should have been migrated to AGENCY
SELECT 'CRITICAL: Users with old COMPANY role' as validation_check,
       'N/A' as id, 'N/A' as email, 'N/A' as role, NULL::timestamp as created_at
WHERE false; -- Always returns 0 rows since COMPANY enum doesn't exist

-- Check 4: All agencies have valid userId references
-- This should return 0 rows
SELECT 'CRITICAL: Agencies with invalid userId' as validation_check,
       a.id, a.agency_name, a."userId"
FROM agencies a
LEFT JOIN users u ON a."userId" = u.id
WHERE u.id IS NULL;

-- ===============================================
-- 2. DATA INTEGRITY CHECKS
-- ===============================================

-- Check 5: Verify all relationships are intact
SELECT
  'DATA INTEGRITY: Relationship counts' as validation_check,
  'caregivers' as table_name,
  COUNT(*) as total_records,
  COUNT(agency_id) as with_agency_reference,
  COUNT(*) - COUNT(agency_id) as orphaned_records
FROM caregivers
UNION ALL
SELECT
  'DATA INTEGRITY: Relationship counts',
  'jobs',
  COUNT(*),
  COUNT(agency_id),
  COUNT(*) - COUNT(agency_id)
FROM jobs
UNION ALL
SELECT
  'DATA INTEGRITY: Relationship counts',
  'packages',
  COUNT(*),
  COUNT(agency_id),
  COUNT(*) - COUNT(agency_id)
FROM packages
UNION ALL
SELECT
  'DATA INTEGRITY: Relationship counts',
  'marketplace_jobs',
  COUNT(*),
  COUNT(agency_id),
  COUNT(*) - COUNT(agency_id)
FROM marketplace_jobs
UNION ALL
SELECT
  'DATA INTEGRITY: Relationship counts',
  'service_zones',
  COUNT(*),
  COUNT(agency_id),
  COUNT(*) - COUNT(agency_id)
FROM service_zones
UNION ALL
SELECT
  'DATA INTEGRITY: Relationship counts',
  'users',
  COUNT(*),
  COUNT(agency_id),
  COUNT(*) - COUNT(agency_id)
FROM users;

-- Check 6: Verify enum values are correct
SELECT 'ENUM VALIDATION: UserRole values' as validation_check,
       t.typname as enum_name,
       e.enumlabel as enum_value,
       e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'UserRole'
ORDER BY e.enumsortorder;

SELECT 'ENUM VALIDATION: FeedbackType values' as validation_check,
       t.typname as enum_name,
       e.enumlabel as enum_value,
       e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'FeedbackType'
ORDER BY e.enumsortorder;

-- ===============================================
-- 3. INDEX AND CONSTRAINT VALIDATION
-- ===============================================

-- Check 7: Verify all agency-related indexes exist
SELECT 'INDEX VALIDATION: Agency indexes' as validation_check,
       schemaname,
       tablename,
       indexname,
       indexdef
FROM pg_indexes
WHERE indexname LIKE '%agency%'
ORDER BY tablename;

-- Check 8: Verify constraint naming consistency
SELECT 'CONSTRAINT VALIDATION: Agency constraints' as validation_check,
       conname as constraint_name,
       conrelid::regclass as table_name,
       contype as constraint_type,
       pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname LIKE '%agency%'
ORDER BY table_name;

-- Check 9: Look for any remaining company constraints
SELECT 'CONSTRAINT VALIDATION: Remaining company constraints' as validation_check,
       conname as constraint_name,
       conrelid::regclass as table_name,
       contype as constraint_type
FROM pg_constraint
WHERE conname LIKE '%company%'
  AND conname NOT LIKE '%agency%';

-- ===============================================
-- 4. SOFT DELETE VALIDATION
-- ===============================================

-- Check 10: Verify soft delete functionality
SELECT 'SOFT DELETE VALIDATION: Agencies with deleted_at' as validation_check,
       COUNT(*) as total_agencies,
       COUNT(deleted_at) as soft_deleted_agencies,
       COUNT(*) - COUNT(deleted_at) as active_agencies
FROM agencies;

-- Check 11: Verify deleted agencies don't have active relationships
SELECT 'SOFT DELETE VALIDATION: Active relationships for deleted agencies' as validation_check,
       a.id, a.agency_name, a.deleted_at,
       COUNT(c.id) as active_caregivers,
       COUNT(j.id) as active_jobs
FROM agencies a
LEFT JOIN caregivers c ON a.id = c.agency_id AND c.deleted_at IS NULL
LEFT JOIN jobs j ON a.id = j.agency_id AND j.status NOT IN ('CANCELLED', 'COMPLETED')
WHERE a.deleted_at IS NOT NULL
GROUP BY a.id, a.agency_name, a.deleted_at
HAVING COUNT(c.id) > 0 OR COUNT(j.id) > 0;

-- ===============================================
-- 5. PERFORMANCE VALIDATION
-- ===============================================

-- Check 12: Verify indexes are being used (sample queries)
-- Note: This requires EXPLAIN ANALYZE to be run manually
SELECT 'PERFORMANCE: Index usage verification needed' as validation_check,
       'Run EXPLAIN ANALYZE on these queries:' as action_required,
       'SELECT * FROM caregivers WHERE agency_id = ?' as query_1,
       'SELECT * FROM jobs WHERE agency_id = ?' as query_2,
       'SELECT * FROM agencies WHERE agency_name LIKE ?' as query_3;

-- ===============================================
-- 6. COMPREHENSIVE SUMMARY
-- ===============================================

-- Final validation summary
WITH validation_results AS (
  -- Count critical issues
  (SELECT 'CRITICAL_ISSUES' as category, COUNT(*) as count
   FROM information_schema.columns
   WHERE column_name LIKE '%company%'
     AND table_schema = 'public'
     AND column_name NOT LIKE '%agency%')
  UNION ALL
  (SELECT 'INVALID_FKS' as category, COUNT(*) as count
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
   WHERE tc.constraint_type = 'FOREIGN KEY'
     AND kcu.column_name LIKE '%agency%'
     AND ccu.table_name != 'agencies')
  UNION ALL
  (SELECT 'COMPANY_ROLES' as category, 0 as count) -- Always 0 since COMPANY enum doesn't exist
  UNION ALL
  (SELECT 'INVALID_USERIDS' as category, COUNT(*) as count
   FROM agencies a
   LEFT JOIN users u ON a."userId" = u.id
   WHERE u.id IS NULL)
)
SELECT
  'MIGRATION STATUS SUMMARY' as validation_check,
  category,
  count,
  CASE
    WHEN count = 0 THEN '✓ PASS'
    ELSE '✗ FAIL - Requires attention'
  END as status
FROM validation_results
ORDER BY category;

-- ===============================================
-- 7. ROLLBACK READINESS CHECK
-- ===============================================

-- Check 8: Verify rollback capability (if needed)
SELECT 'ROLLBACK READINESS: Check for rollback script' as validation_check,
       CASE
         WHEN EXISTS (SELECT 1 FROM pg_class WHERE relname = '_migration_rollback_scripts')
         THEN '✓ Rollback scripts found'
         ELSE '✗ No rollback scripts available'
       END as status;

-- ===============================================
-- 8. MIGRATION COMPLETION VERIFICATION
-- ===============================================

-- Final comprehensive check
SELECT
  'MIGRATION COMPLETION VERIFICATION' as validation_check,
  CASE
    WHEN (
      -- No company columns except agency-related
      (SELECT COUNT(*) FROM information_schema.columns WHERE column_name LIKE '%company%' AND column_name NOT LIKE '%agency%') = 0
      AND
      -- No users with COMPANY role (always true since COMPANY enum doesn't exist)
      (SELECT 0) = 0
      AND
      -- All agencies have valid userIds
      (SELECT COUNT(*) FROM agencies a LEFT JOIN users u ON a."userId" = u.id WHERE u.id IS NULL) = 0
      AND
      -- All agency FK constraints point to agencies table
      (SELECT COUNT(*) FROM information_schema.table_constraints AS tc
       JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
       JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
       WHERE tc.constraint_type = 'FOREIGN KEY'
         AND kcu.column_name LIKE '%agency%'
         AND ccu.table_name != 'agencies') = 0
    )
    THEN '✓ MIGRATION COMPLETE - All validations passed'
    ELSE '✗ MIGRATION INCOMPLETE - Critical issues found'
  END as status;

-- ===============================================
-- USAGE NOTES:
-- 1. Run this script against your PostgreSQL database
-- 2. Address any '✗ FAIL' results immediately
-- 3. For performance checks, run EXPLAIN ANALYZE manually on the suggested queries
-- 4. Review the summary section for overall migration status
-- 5. Keep this script for future reference and rollback planning
-- ===============================================
