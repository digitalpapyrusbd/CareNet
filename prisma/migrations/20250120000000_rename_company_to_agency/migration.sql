-- Rename Company to Agency Migration

-- Step 1: Rename table companies to agencies
ALTER TABLE "companies" RENAME TO "agencies";

-- Step 2: Rename column company_name to agency_name
ALTER TABLE "agencies" RENAME COLUMN "company_name" TO "agency_name";

-- Step 3: Update enum UserRole: COMPANY -> AGENCY
-- First, add the new value
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'AGENCY';

-- Step 4: Update enum FeedbackType: COMPANY -> AGENCY  
ALTER TYPE "FeedbackType" ADD VALUE IF NOT EXISTS 'AGENCY';

-- Step 5: Update all foreign key columns
-- caregivers table
ALTER TABLE "caregivers" RENAME COLUMN "company_id" TO "agency_id";
ALTER TABLE "caregivers" DROP CONSTRAINT IF EXISTS "caregivers_company_id_fkey";
ALTER TABLE "caregivers" ADD CONSTRAINT "caregivers_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- jobs table
ALTER TABLE "jobs" RENAME COLUMN "company_id" TO "agency_id";
ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "jobs_company_id_fkey";
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- packages table
ALTER TABLE "packages" RENAME COLUMN "company_id" TO "agency_id";
ALTER TABLE "packages" DROP CONSTRAINT IF EXISTS "packages_company_id_fkey";
ALTER TABLE "packages" ADD CONSTRAINT "packages_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- marketplace_jobs table
ALTER TABLE "marketplace_jobs" RENAME COLUMN "company_id" TO "agency_id";
ALTER TABLE "marketplace_jobs" DROP CONSTRAINT IF EXISTS "marketplace_jobs_company_id_fkey";
ALTER TABLE "marketplace_jobs" ADD CONSTRAINT "marketplace_jobs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- service_zones table
ALTER TABLE "service_zones" RENAME COLUMN "company_id" TO "agency_id";
ALTER TABLE "service_zones" DROP CONSTRAINT IF EXISTS "service_zones_company_id_fkey";
ALTER TABLE "service_zones" ADD CONSTRAINT "service_zones_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- users table
ALTER TABLE "users" RENAME COLUMN "company_id" TO "agency_id";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_company_id_fkey";
ALTER TABLE "users" ADD CONSTRAINT "users_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 6: Update feedbacks table
ALTER TABLE "feedbacks" RENAME COLUMN "company_response" TO "agency_response";

-- Step 7: Update indexes
DROP INDEX IF EXISTS "caregivers_company_id_idx";
CREATE INDEX IF NOT EXISTS "caregivers_agency_id_idx" ON "caregivers"("agency_id");

DROP INDEX IF EXISTS "jobs_company_id_idx";
CREATE INDEX IF NOT EXISTS "jobs_agency_id_idx" ON "jobs"("agency_id");

DROP INDEX IF EXISTS "packages_company_id_idx";
CREATE INDEX IF NOT EXISTS "packages_agency_id_idx" ON "packages"("agency_id");

DROP INDEX IF EXISTS "marketplace_jobs_company_id_idx";
CREATE INDEX IF NOT EXISTS "marketplace_jobs_agency_id_idx" ON "marketplace_jobs"("agency_id");

DROP INDEX IF EXISTS "service_zones_company_id_idx";
CREATE INDEX IF NOT EXISTS "service_zones_agency_id_idx" ON "service_zones"("agency_id");

-- Step 8: Update existing UserRole values from COMPANY to AGENCY
UPDATE "users" SET "role" = 'AGENCY' WHERE "role" = 'COMPANY';

-- Step 9: Update existing FeedbackType values from COMPANY to AGENCY
UPDATE "feedbacks" SET "reviewee_type" = 'AGENCY' WHERE "reviewee_type" = 'COMPANY';

-- Note: The old enum values (COMPANY) cannot be removed from PostgreSQL enums
-- They will remain but should not be used going forward
