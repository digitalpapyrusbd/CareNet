-- CreateTable
CREATE TABLE "escrow_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "escrow_ledger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "escrow_record_id" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "escrow_ledger_escrow_record_id_fkey" FOREIGN KEY ("escrow_record_id") REFERENCES "escrow_records" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "provider_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_verification_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "verification_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_verification_codes" ("code", "createdAt", "expiresAt", "id", "isUsed", "type", "updatedAt", "usedAt", "userId") SELECT "code", "createdAt", "expiresAt", "id", "isUsed", "type", "updatedAt", "usedAt", "userId" FROM "verification_codes";
DROP TABLE "verification_codes";
ALTER TABLE "new_verification_codes" RENAME TO "verification_codes";
CREATE INDEX "verification_codes_userId_idx" ON "verification_codes"("userId");
CREATE INDEX "verification_codes_code_idx" ON "verification_codes"("code");
CREATE INDEX "verification_codes_expiresAt_idx" ON "verification_codes"("expiresAt");
CREATE INDEX "verification_codes_isUsed_idx" ON "verification_codes"("isUsed");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "escrow_records_user_id_idx" ON "escrow_records"("user_id");

-- CreateIndex
CREATE INDEX "escrow_ledger_escrow_record_id_idx" ON "escrow_ledger"("escrow_record_id");

-- CreateIndex
CREATE INDEX "provider_transactions_provider_transaction_id_idx" ON "provider_transactions"("provider", "transaction_id");
