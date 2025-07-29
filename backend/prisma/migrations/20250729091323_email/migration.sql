-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastVerificationCodeSent" TIMESTAMP(3),
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationCodeExpiry" TIMESTAMP(3);
