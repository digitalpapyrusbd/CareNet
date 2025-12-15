/*
  Warnings:

  - You are about to drop the column `action` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `disputes` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `disputes` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `action_type` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_type` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `against` to the `disputes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `disputes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dispute_type` to the `disputes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_id` to the `disputes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_id` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewee_type` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "service_zones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT NOT NULL,
    "zone_name" TEXT NOT NULL,
    "region_code" TEXT NOT NULL,
    "boundary_geojson" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "service_zones_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "marketplace_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT NOT NULL,
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
    CONSTRAINT "marketplace_jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "marketplace_jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "marketplace_jobs_filled_by_fkey" FOREIGN KEY ("filled_by") REFERENCES "caregivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marketplace_job_id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "coverLetter" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewed_by" TEXT,
    "reviewed_at" DATETIME,
    "review_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "job_applications_marketplace_job_id_fkey" FOREIGN KEY ("marketplace_job_id") REFERENCES "marketplace_jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "job_applications_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "job_applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PRIMARY',
    "shift_start_time" TEXT NOT NULL,
    "shift_end_time" TEXT NOT NULL,
    "days_of_week" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "replaced_by" TEXT,
    "replacement_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "assignments_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignments_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignments_replaced_by_fkey" FOREIGN KEY ("replaced_by") REFERENCES "caregivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_assignments" ("caregiver_id", "created_at", "days_of_week", "id", "job_id", "replaced_by", "replacement_reason", "role", "shift_end_time", "shift_start_time", "status", "updated_at") SELECT "caregiver_id", "created_at", "days_of_week", "id", "job_id", "replaced_by", "replacement_reason", "role", "shift_end_time", "shift_start_time", "status", "updated_at" FROM "assignments";
DROP TABLE "assignments";
ALTER TABLE "new_assignments" RENAME TO "assignments";
CREATE INDEX "assignments_job_id_idx" ON "assignments"("job_id");
CREATE INDEX "assignments_caregiver_id_idx" ON "assignments"("caregiver_id");
CREATE UNIQUE INDEX "assignments_job_id_caregiver_id_role_key" ON "assignments"("job_id", "caregiver_id", "role");
CREATE TABLE "new_audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actor_id" TEXT,
    "actor_role" TEXT,
    "action_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "changes" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_audit_logs" ("id") SELECT "id" FROM "audit_logs";
DROP TABLE "audit_logs";
ALTER TABLE "new_audit_logs" RENAME TO "audit_logs";
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");
CREATE INDEX "audit_logs_action_type_idx" ON "audit_logs"("action_type");
CREATE TABLE "new_disputes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "raised_by" TEXT NOT NULL,
    "against" TEXT NOT NULL,
    "dispute_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidence_urls" JSONB,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assigned_moderator" TEXT,
    "resolution" TEXT,
    "resolution_action" TEXT,
    "resolved_at" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "disputes_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "disputes_raised_by_fkey" FOREIGN KEY ("raised_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "disputes_against_fkey" FOREIGN KEY ("against") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_disputes" ("createdAt", "id", "raised_by", "resolution", "status", "updatedAt") SELECT "createdAt", "id", "raised_by", "resolution", "status", "updatedAt" FROM "disputes";
DROP TABLE "disputes";
ALTER TABLE "new_disputes" RENAME TO "disputes";
CREATE INDEX "disputes_job_id_idx" ON "disputes"("job_id");
CREATE INDEX "disputes_status_idx" ON "disputes"("status");
CREATE INDEX "disputes_assigned_moderator_idx" ON "disputes"("assigned_moderator");
CREATE TABLE "new_feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "reviewee_type" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "tags" JSONB,
    "comments" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "company_response" TEXT,
    "responded_at" DATETIME,
    "flagged_inappropriate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "feedbacks_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_feedbacks" ("createdAt", "from_user_id", "id", "rating", "to_user_id") SELECT "createdAt", "from_user_id", "id", "rating", "to_user_id" FROM "feedbacks";
DROP TABLE "feedbacks";
ALTER TABLE "new_feedbacks" RENAME TO "feedbacks";
CREATE INDEX "feedbacks_to_user_id_reviewee_type_idx" ON "feedbacks"("to_user_id", "reviewee_type");
CREATE INDEX "feedbacks_job_id_idx" ON "feedbacks"("job_id");
CREATE INDEX "feedbacks_is_public_rating_idx" ON "feedbacks"("is_public", "rating");
CREATE UNIQUE INDEX "feedbacks_job_id_from_user_id_to_user_id_key" ON "feedbacks"("job_id", "from_user_id", "to_user_id");
CREATE TABLE "new_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sent_at" DATETIME,
    "delivered_at" DATETIME,
    "read_at" DATETIME,
    "error_message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("createdAt", "id", "type", "userId") SELECT "createdAt", "id", "type", "userId" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX "notifications_status_idx" ON "notifications"("status");
CREATE INDEX "notifications_sent_at_idx" ON "notifications"("sent_at");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT NOT NULL,
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
    "company_id" TEXT,
    CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("company_id", "created_at", "deleted_at", "email", "id", "is_active", "kyc_document_url", "kyc_status", "language", "last_login_at", "mfa_enabled", "mfa_secret", "name", "password_hash", "phone", "role", "updated_at") SELECT "company_id", "created_at", "deleted_at", "email", "id", "is_active", "kyc_document_url", "kyc_status", "language", "last_login_at", "mfa_enabled", "mfa_secret", "name", "password_hash", "phone", "role", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_phone_idx" ON "users"("phone");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_kyc_status_idx" ON "users"("kyc_status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "service_zones_company_id_idx" ON "service_zones"("company_id");

-- CreateIndex
CREATE INDEX "service_zones_region_code_idx" ON "service_zones"("region_code");

-- CreateIndex
CREATE INDEX "marketplace_jobs_company_id_idx" ON "marketplace_jobs"("company_id");

-- CreateIndex
CREATE INDEX "marketplace_jobs_status_idx" ON "marketplace_jobs"("status");

-- CreateIndex
CREATE INDEX "marketplace_jobs_start_date_idx" ON "marketplace_jobs"("start_date");

-- CreateIndex
CREATE INDEX "job_applications_marketplace_job_id_idx" ON "job_applications"("marketplace_job_id");

-- CreateIndex
CREATE INDEX "job_applications_caregiver_id_idx" ON "job_applications"("caregiver_id");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_marketplace_job_id_caregiver_id_key" ON "job_applications"("marketplace_job_id", "caregiver_id");

-- CreateIndex
CREATE INDEX "care_logs_log_type_idx" ON "care_logs"("log_type");

-- CreateIndex
CREATE INDEX "caregivers_rating_avg_idx" ON "caregivers"("rating_avg");

-- CreateIndex
CREATE INDEX "caregivers_skills_idx" ON "caregivers"("skills");

-- CreateIndex
CREATE INDEX "companies_userId_idx" ON "companies"("userId");

-- CreateIndex
CREATE INDEX "companies_rating_avg_idx" ON "companies"("rating_avg");

-- CreateIndex
CREATE INDEX "health_records_record_type_idx" ON "health_records"("record_type");

-- CreateIndex
CREATE INDEX "jobs_start_date_end_date_idx" ON "jobs"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "jobs_guardian_id_idx" ON "jobs"("guardian_id");

-- CreateIndex
CREATE INDEX "packages_category_idx" ON "packages"("category");

-- CreateIndex
CREATE INDEX "packages_is_active_idx" ON "packages"("is_active");

-- CreateIndex
CREATE INDEX "patients_primaryConditions_idx" ON "patients"("primaryConditions");

-- CreateIndex
CREATE INDEX "payments_transaction_id_idx" ON "payments"("transaction_id");
