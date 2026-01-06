/*
  Warnings:

  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `company_id` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `service_zones` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "companies_is_verified_idx";

-- DropIndex
DROP INDEX "companies_userId_idx";

-- DropIndex
DROP INDEX "companies_rating_avg_idx";

-- DropIndex
DROP INDEX "companies_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "companies";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_caregivers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "agency_id" TEXT,
    "company_id" TEXT,
    "nid" TEXT NOT NULL,
    "nid_url" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "date_of_birth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "location_lat" DECIMAL,
    "location_lng" DECIMAL,
    "skills" JSONB NOT NULL,
    "certifications" JSONB,
    "experience_years" INTEGER NOT NULL DEFAULT 0,
    "languages" JSONB NOT NULL DEFAULT ["bn"],
    "availabilityCalendar" JSONB,
    "hourly_rate" DECIMAL,
    "background_check_status" TEXT NOT NULL DEFAULT 'PENDING',
    "background_check_date" DATETIME,
    "rating_avg" DECIMAL NOT NULL DEFAULT 0.0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "total_jobs_completed" INTEGER NOT NULL DEFAULT 0,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "caregivers_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "caregivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_caregivers" ("address", "agency_id", "availabilityCalendar", "background_check_date", "background_check_status", "certifications", "company_id", "created_at", "date_of_birth", "deleted_at", "experience_years", "gender", "hourly_rate", "id", "is_available", "is_verified", "languages", "location_lat", "location_lng", "nid", "nid_url", "photo_url", "rating_avg", "rating_count", "skills", "total_jobs_completed", "updated_at", "userId") SELECT "address", "agency_id", "availabilityCalendar", "background_check_date", "background_check_status", "certifications", "company_id", "created_at", "date_of_birth", "deleted_at", "experience_years", "gender", "hourly_rate", "id", "is_available", "is_verified", "languages", "location_lat", "location_lng", "nid", "nid_url", "photo_url", "rating_avg", "rating_count", "skills", "total_jobs_completed", "updated_at", "userId" FROM "caregivers";
DROP TABLE "caregivers";
ALTER TABLE "new_caregivers" RENAME TO "caregivers";
CREATE UNIQUE INDEX "caregivers_userId_key" ON "caregivers"("userId");
CREATE UNIQUE INDEX "caregivers_nid_key" ON "caregivers"("nid");
CREATE INDEX "caregivers_skills_idx" ON "caregivers"("skills");
CREATE INDEX "caregivers_rating_avg_idx" ON "caregivers"("rating_avg");
CREATE INDEX "caregivers_is_verified_is_available_idx" ON "caregivers"("is_verified", "is_available");
CREATE INDEX "caregivers_agency_id_idx" ON "caregivers"("agency_id");
CREATE TABLE "new_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "package_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "agency_id" TEXT,
    "guardian_id" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    "total_price" DECIMAL NOT NULL,
    "commission_amount" DECIMAL NOT NULL,
    "payout_amount" DECIMAL NOT NULL,
    "special_instructions" TEXT,
    "completion_notes" TEXT,
    "cancelled_reason" TEXT,
    "cancelled_at" DATETIME,
    "cancelled_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "jobs_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "jobs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "jobs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "jobs_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_jobs" ("agency_id", "cancelled_at", "cancelled_by", "cancelled_reason", "commission_amount", "completion_notes", "created_at", "end_date", "guardian_id", "id", "package_id", "patient_id", "payout_amount", "special_instructions", "start_date", "status", "total_price", "updated_at") SELECT "agency_id", "cancelled_at", "cancelled_by", "cancelled_reason", "commission_amount", "completion_notes", "created_at", "end_date", "guardian_id", "id", "package_id", "patient_id", "payout_amount", "special_instructions", "start_date", "status", "total_price", "updated_at" FROM "jobs";
DROP TABLE "jobs";
ALTER TABLE "new_jobs" RENAME TO "jobs";
CREATE INDEX "jobs_guardian_id_idx" ON "jobs"("guardian_id");
CREATE INDEX "jobs_start_date_end_date_idx" ON "jobs"("start_date", "end_date");
CREATE INDEX "jobs_status_idx" ON "jobs"("status");
CREATE INDEX "jobs_agency_id_idx" ON "jobs"("agency_id");
CREATE INDEX "jobs_patient_id_idx" ON "jobs"("patient_id");
CREATE TABLE "new_marketplace_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT,
    "agency_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "required_skills" JSONB NOT NULL,
    "start_date" DATETIME NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "hours_per_day" INTEGER NOT NULL,
    "offered_rate" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "applications_count" INTEGER NOT NULL DEFAULT 0,
    "filled_by" TEXT,
    "filled_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "marketplace_jobs_filled_by_fkey" FOREIGN KEY ("filled_by") REFERENCES "caregivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "marketplace_jobs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_marketplace_jobs" ("agency_id", "applications_count", "company_id", "created_at", "description", "duration_days", "filled_at", "filled_by", "hours_per_day", "id", "location", "offered_rate", "required_skills", "start_date", "status", "title", "updated_at") SELECT "agency_id", "applications_count", "company_id", "created_at", "description", "duration_days", "filled_at", "filled_by", "hours_per_day", "id", "location", "offered_rate", "required_skills", "start_date", "status", "title", "updated_at" FROM "marketplace_jobs";
DROP TABLE "marketplace_jobs";
ALTER TABLE "new_marketplace_jobs" RENAME TO "marketplace_jobs";
CREATE INDEX "marketplace_jobs_start_date_idx" ON "marketplace_jobs"("start_date");
CREATE INDEX "marketplace_jobs_status_idx" ON "marketplace_jobs"("status");
CREATE INDEX "marketplace_jobs_agency_id_idx" ON "marketplace_jobs"("agency_id");
CREATE TABLE "new_packages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agency_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "hours_per_day" INTEGER NOT NULL,
    "inclusions" JSONB NOT NULL,
    "exclusions" JSONB,
    "caregiver_count" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "min_advance_days" INTEGER NOT NULL DEFAULT 2,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "packages_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_packages" ("agency_id", "caregiver_count", "category", "created_at", "description", "duration_days", "exclusions", "hours_per_day", "id", "inclusions", "is_active", "min_advance_days", "name", "price", "updated_at") SELECT "agency_id", "caregiver_count", "category", "created_at", "description", "duration_days", "exclusions", "hours_per_day", "id", "inclusions", "is_active", "min_advance_days", "name", "price", "updated_at" FROM "packages";
DROP TABLE "packages";
ALTER TABLE "new_packages" RENAME TO "packages";
CREATE INDEX "packages_is_active_idx" ON "packages"("is_active");
CREATE INDEX "packages_category_idx" ON "packages"("category");
CREATE INDEX "packages_agency_id_idx" ON "packages"("agency_id");
CREATE TABLE "new_service_zones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agency_id" TEXT NOT NULL,
    "zone_name" TEXT NOT NULL,
    "region_code" TEXT NOT NULL,
    "boundary_geojson" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "service_zones_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_service_zones" ("agency_id", "boundary_geojson", "created_at", "id", "is_active", "region_code", "updated_at", "zone_name") SELECT "agency_id", "boundary_geojson", "created_at", "id", "is_active", "region_code", "updated_at", "zone_name" FROM "service_zones";
DROP TABLE "service_zones";
ALTER TABLE "new_service_zones" RENAME TO "service_zones";
CREATE INDEX "service_zones_region_code_idx" ON "service_zones"("region_code");
CREATE INDEX "service_zones_agency_id_idx" ON "service_zones"("agency_id");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "kyc_status" TEXT NOT NULL DEFAULT 'PENDING',
    "kyc_document_url" TEXT,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "last_login_at" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "agency_id" TEXT,
    "google_id" TEXT,
    "google_email" TEXT,
    CONSTRAINT "users_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("agency_id", "created_at", "deleted_at", "email", "id", "is_active", "kyc_document_url", "kyc_status", "language", "last_login_at", "mfa_enabled", "mfa_secret", "name", "password_hash", "phone", "role", "updated_at") SELECT "agency_id", "created_at", "deleted_at", "email", "id", "is_active", "kyc_document_url", "kyc_status", "language", "last_login_at", "mfa_enabled", "mfa_secret", "name", "password_hash", "phone", "role", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");
CREATE INDEX "users_kyc_status_idx" ON "users"("kyc_status");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_phone_idx" ON "users"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
