/*
  Warnings:

  - You are about to drop the column `promoCodeUsageLimit` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `promoCodeUsagesCount` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the `PromoCodeUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('promoCodeUsage');

-- DropForeignKey
ALTER TABLE "PromoCodeUsage" DROP CONSTRAINT "PromoCodeUsage_ambassadorId_fkey";

-- DropForeignKey
ALTER TABLE "PromoCodeUsage" DROP CONSTRAINT "PromoCodeUsage_sprintId_fkey";

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "promoCodeUsageLimit",
DROP COLUMN "promoCodeUsagesCount",
ADD COLUMN     "EventLimit" INTEGER,
ADD COLUMN     "EventsCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "PromoCodeUsage";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "EventType" NOT NULL,
    "data" JSONB NOT NULL,
    "sprintId" TEXT,
    "ambassadorId" TEXT,
    "roomId" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ambassadorId_fkey" FOREIGN KEY ("ambassadorId") REFERENCES "Ambassador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
