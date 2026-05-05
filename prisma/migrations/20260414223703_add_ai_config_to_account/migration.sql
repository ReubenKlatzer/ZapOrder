-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "aiApiKey" TEXT,
ADD COLUMN     "aiModel" TEXT,
ADD COLUMN     "aiProvider" TEXT DEFAULT 'groq';
