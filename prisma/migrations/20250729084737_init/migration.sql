-- CreateEnum
CREATE TYPE "ClaimType" AS ENUM ('Home', 'Auto', 'Health', 'Property', 'Life');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('Low', 'Medium', 'High');

-- CreateTable
CREATE TABLE "Claims" (
    "claimID" TEXT NOT NULL,
    "claimType" "ClaimType" NOT NULL,
    "Priority" "PriorityLevel" NOT NULL,
    "Description" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Claims_pkey" PRIMARY KEY ("claimID")
);
