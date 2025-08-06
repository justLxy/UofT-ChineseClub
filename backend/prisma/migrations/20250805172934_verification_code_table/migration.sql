/*
  Warnings:

  - You are about to drop the column `lastVerificationCodeSent` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCodeAttempts` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCodeExpiry` on the `Staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "lastVerificationCodeSent",
DROP COLUMN "verificationCode",
DROP COLUMN "verificationCodeAttempts",
DROP COLUMN "verificationCodeExpiry";

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_email_key" ON "VerificationCode"("email");
