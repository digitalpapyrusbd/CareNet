<tool_call>
<function=edit_file>
<parameter=path>
/home/zia/Documents/My Projects/SynologyDrive/Websites/Caregiver/prisma/rollback-agency-to-company.sql
</parameter>
<parameter=display_description>
Create comprehensive rollback script for migration
</parameter>
<parameter=mode>
create
</parameter>
<parameter=content>
-- ============================================================================
-- MIGRATION ROLLBACK SCRIPT: Agency → Company
--
-- WARNING: This script will roll back the Company → Agency migration
-- Use only if absolutely necessary and ensure you have a complete backup
--
-- Created: December 2024
-- Purpose: Rollback database changes if migration needs to be reversed
-- ============================================================================
--
-- BEFORE RUNNING THIS SCRIPT:
-- 1. Ensure you have a complete database backup
-- 2. Stop all application services
-- 3. Notify all stakeholders
-- 4. Run during maintenance window
-- 5. Test rollback in staging environment first
--
-- AFTER RUNNING THIS SCRIPT:
-- 1. Update application code to use old field names
-- 2. Update API endpoints
-- 3. Update frontend references
-- 4. Update documentation
-- 5. Restart services
-- ============================================================================

\echo '=== MIGRATION ROLLBACK STARTED ==='
\echo 'WARNING: This will rollback Agency → Company migration'
\echo 'Ensure you have completed all pre-rollback checks'

-- ============================================================================
-- 1. VALIDATION CHECKS (Pre-rollback validation)
-- ============================================================================

\echo '1. Validating rollback prerequisites...'

-- Check if agencies table exists
DO $$
DECLARE
  agencies_exist BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agencies') INTO agencies_exist;

  IF NOT agencies_exist THEN
    RAISE EXCEPTION 'ERROR: agencies table not found. Rollback not needed or migration never completed.';
  END IF;

  RAISE NOTICE '✓ agencies table found, proceeding with rollback';
END $$;

-- Check if companies table already exists (should not exist)
DO $$
DECLARE
  companies_exist BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') INTO companies_exist;

  IF companies_exist THEN
    RAISE EXCEPTION 'ERROR: companies table already exists. Manual cleanup required before rollback.';
  END IF;

  RAISE NOTICE '✓ companies table does not exist, proceeding with rollback';
END $$;

-- Check for data integrity issues
\echo '2. Checking data integrity...'
SELECT
  CASE
    WHEN (SELECT COUNT(*) FROM agencies WHERE "userId" IS NULL) > 0
    THEN 'WARNING: Found agencies with NULL userId - data integrity issue'
    ELSE '✓ All agencies have valid userId references'
  END as agency_user_validation;

SELECT
  CASE
    WHEN (SELECT COUNT(*) FROM users WHERE role = 'AGENCY') = 0
    THEN 'WARNING: No users with AGENCY role found'
    ELSE '✓ Found users with AGENCY role'
  END as agency_role_validation;

-- ============================================================================
-- 3. BACKUP CRITICAL DATA (Before making changes)
-- ============================================================================

\echo '3. Creating backup tables...'

-- Create backup of agencies table
DROP TABLE IF EXISTS _backup_agencies;
CREATE TABLE _backup_agencies AS SELECT * FROM agencies;

-- Create backup of users with AGENCY role
DROP TABLE IF EXISTS _backup_users_agency;
CREATE TABLE _backup_users_agency AS
SELECT * FROM users WHERE role = 'AGENCY';

\echo '✓ Backup tables created:'
\echo '  - _backup_agencies'
\echo '  - _backup_users_agency'

-- ============================================================================
-- 4. ROLLBACK MIGRATION (Reverse all changes)
-- ============================================================================

\echo '4. Starting rollback migration...'

-- Begin transaction for rollback
BEGIN;

-- Step 1: Restore companies table from agencies
\echo '4.1 Restoring companies table...'
ALTER TABLE agencies RENAME TO companies;

-- Step 2: Rename columns back to company_*
\echo '4.2 Renaming columns back to company_*...'
ALTER TABLE companies RENAME COLUMN agency_name TO company_name;
ALTER TABLE companies RENAME COLUMN "userId" TO "userId";

-- Step 3: Update foreign key references in related tables
\echo '4.3 Updating foreign key references...'

-- caregivers table
ALTER TABLE caregivers RENAME COLUMN agency_id TO company_id;
ALTER TABLE caregivers DROP CONSTRAINT IF EXISTS caregivers_agency_id_fkey;
ALTER TABLE caregivers ADD CONSTRAINT caregivers_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- jobs table
ALTER TABLE jobs RENAME COLUMN agency_id TO company_id;
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_agency_id_fkey;
ALTER TABLE jobs ADD CONSTRAINT jobs_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- packages table
ALTER TABLE packages RENAME COLUMN agency_id TO company_id;
ALTER TABLE packages DROP CONSTRAINT IF EXISTS packages_agency_id_fkey;
ALTER TABLE packages ADD CONSTRAINT packages_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- marketplace_jobs table
ALTER TABLE marketplace_jobs RENAME COLUMN agency_id TO company_id;
ALTER TABLE marketplace_jobs DROP CONSTRAINT IF EXISTS marketplace_jobs_agency_id_fkey;
ALTER TABLE marketplace_jobs ADD CONSTRAINT marketplace_jobs_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- service_zones table
ALTER TABLE service_zones RENAME COLUMN agency_id TO company_id;
ALTER TABLE service_zones DROP CONSTRAINT IF EXISTS service_zones_agency_id_fkey;
ALTER TABLE service_zones ADD CONSTRAINT service_zones_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- users table
ALTER TABLE users RENAME COLUMN agency_id TO company_id;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_agency_id_fkey;
ALTER TABLE users ADD CONSTRAINT users_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- feedbacks table
ALTER TABLE feedbacks RENAME COLUMN agency_response TO company_response;

-- Step 4: Update indexes
\echo '4.4 Updating indexes...'
DROP INDEX IF EXISTS caregivers_agency_id_idx;
CREATE INDEX IF NOT EXISTS caregivers_company_id_idx ON caregivers(company_id);

DROP INDEX IF EXISTS jobs_agency_id_idx;
CREATE INDEX IF NOT EXISTS jobs_company_id_idx ON jobs(company_id);

DROP INDEX IF EXISTS packages_agency_id_idx;
CREATE INDEX IF NOT EXISTS packages_company_id_idx ON packages(company_id);

DROP INDEX IF EXISTS marketplace_jobs_agency_id_idx;
CREATE INDEX IF NOT EXISTS marketplace_jobs_company_id_idx ON marketplace_jobs(company_id);

DROP INDEX IF EXISTS service_zones_agency_id_idx;
CREATE INDEX IF NOT EXISTS service_zones_company_id_idx ON service_zones(company_id);

-- Step 5: Update enum values (remove AGENCY, restore COMPANY usage)
\echo '4.5 Updating enum values...'
-- Note: PostgreSQL doesn't allow removing enum values directly
-- We'll update the data to use COMPANY instead of AGENCY

-- Update users with AGENCY role back to COMPANY
UPDATE users SET role = 'COMPANY' WHERE role = 'AGENCY';

-- Update feedbacks with AGENCY type back to COMPANY
UPDATE feedbacks SET reviewee_type = 'COMPANY' WHERE reviewee_type = 'AGENCY';

-- Step 6: Restore original table name and constraints
\echo '4.6 Finalizing table structure...'

-- Ensure companies table has correct structure
ALTER TABLE companies ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
ALTER TABLE companies ADD CONSTRAINT companies_userId_key UNIQUE ("userId");

-- ============================================================================
-- 5. VALIDATION (Post-rollback validation)
-- ============================================================================

\echo '5. Validating rollback completion...'

-- Check companies table exists
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies')
    THEN '✓ companies table restored'
    ELSE '✗ companies table not found'
  END as companies_table_check;

-- Check no orphaned agency references
SELECT
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE column_name LIKE '%agency%' AND table_schema = 'public') = 0
    THEN '✓ No orphaned agency references'
    ELSE '✗ Found orphaned agency references'
  END as orphaned_agency_check;

-- Check foreign key constraints
SELECT
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_name LIKE '%company_id_fkey%') >= 5
    THEN '✓ All foreign key constraints restored'
    ELSE '✗ Foreign key constraints missing'
  END as fk_constraints_check;

-- Check enum values
SELECT
  CASE
    WHEN (SELECT COUNT(*) FROM users WHERE role = 'COMPANY') > 0
    THEN '✓ Users have COMPANY role'
    ELSE '✗ No users with COMPANY role'
  END as company_role_check;

-- ============================================================================
-- 6. CLEANUP (Remove backup tables if rollback successful)
-- ============================================================================

\echo '6. Cleaning up backup tables...'

-- Only drop backup tables if rollback was successful
-- Keep them for safety until you verify everything works

\echo '✓ Backup tables preserved for safety:'
\echo '  - _backup_agencies (now _backup_companies)'
\echo '  - _backup_users_agency'

-- ============================================================================
-- 7. FINAL SUMMARY
-- ============================================================================

\echo '=== ROLLBACK COMPLETED ==='
\echo ''
\echo 'IMPORTANT NEXT STEPS:'
\echo '1. Update application code to use old field names:'
\echo '   - company_name (not agency_name)'
\echo '   - company_id (not agency_id)'
\echo '   - company_response (not agency_response)'
\echo ''
\echo '2. Update API endpoints:'
\echo '   - /api/companies/* (not /api/agencies/*)'
\echo ''
\echo '3. Update frontend code:'
\echo '   - Form fields, labels, and validation'
\echo '   - API calls and data handling'
\echo ''
\echo '4. Update documentation:'
\echo '   - API docs, database schema docs'
\echo '   - User guides and admin manuals'
\echo ''
\echo '5. Test thoroughly in staging before production'
\echo ''
\echo '6. Monitor application logs for any remaining issues'

-- Commit the transaction
COMMIT;

\echo '=== ROLLBACK TRANSACTION COMMITTED ==='

-- ============================================================================
-- 8. POST-ROLLBACK VERIFICATION SCRIPT
-- ============================================================================
-- Run this separately to verify everything works:

\echo 'To verify rollback success, run these queries:'
\echo ''
\echo '-- Check companies table:'
\echo 'SELECT COUNT(*) FROM companies;'
\echo ''
\echo '-- Check for any remaining agency references:'
\echo "SELECT table_name, column_name FROM information_schema.columns WHERE column_name LIKE '%agency%';"
\echo ''
\echo '-- Check foreign key relationships:'
\echo "SELECT * FROM information_schema.table_constraints WHERE constraint_name LIKE '%company%';"
\echo ''
\echo '-- Test data integrity:'
\echo 'SELECT c.company_name, COUNT(ca.id) as caregiver_count'
\echo 'FROM companies c'
\echo 'LEFT JOIN caregivers ca ON c.id = ca.company_id'
\echo 'GROUP BY c.id, c.company_name;'
\echo ''

-- ============================================================================
-- 9. EMERGENCY CONTACT INFORMATION
-- ============================================================================
-- If rollback fails or causes issues:
-- 1. Restore from backup immediately
-- 2. Contact database administrator
-- 3. Check application logs for errors
-- 4. Verify all services are restarted with updated code

\echo '=== ROLLBACK SCRIPT COMPLETE ==='
</parameter>
</function>
</tool_call>
