-- CreateTable
CREATE TABLE "verification_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "verification_codes.userId_index" ON "verification_codes"("userId");

-- CreateIndex
CREATE INDEX "verification_codes.code_index" ON "verification_codes"("code");

-- CreateIndex
CREATE INDEX "verification_codes.expiresAt_index" ON "verification_codes"("expiresAt");

-- CreateIndex
CREATE INDEX "verification_codes.isUsed_index" ON "verification_codes"("isUsed");