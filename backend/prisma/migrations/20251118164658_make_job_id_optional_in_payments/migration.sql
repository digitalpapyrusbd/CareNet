-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_job_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "job_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
