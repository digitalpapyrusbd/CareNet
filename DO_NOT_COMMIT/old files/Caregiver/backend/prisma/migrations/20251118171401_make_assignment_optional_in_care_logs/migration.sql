-- DropForeignKey
ALTER TABLE "care_logs" DROP CONSTRAINT "care_logs_assignment_id_fkey";

-- AlterTable
ALTER TABLE "care_logs" ALTER COLUMN "assignment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "care_logs" ADD CONSTRAINT "care_logs_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
