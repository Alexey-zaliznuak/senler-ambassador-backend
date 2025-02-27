/*
  Warnings:

  - You are about to drop the column `webhookUrls` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `promoCode` on the `Sprint` table. All the data in the column will be lost.
  - Added the required column `webhookUrl` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "webhookUrls",
ADD COLUMN     "webhookUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "promoCode",
ADD COLUMN     "promoCodeUsagesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PromoCodeUsage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sprintId" TEXT NOT NULL,
    "ambassadorId" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,

    CONSTRAINT "PromoCodeUsage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromoCodeUsage" ADD CONSTRAINT "PromoCodeUsage_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCodeUsage" ADD CONSTRAINT "PromoCodeUsage_ambassadorId_fkey" FOREIGN KEY ("ambassadorId") REFERENCES "Ambassador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
