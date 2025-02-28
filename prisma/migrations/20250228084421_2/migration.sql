/*
  Warnings:

  - You are about to drop the column `EventLimit` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `EventsCount` on the `Sprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "EventLimit",
DROP COLUMN "EventsCount",
ADD COLUMN     "promoCodeUsageLimit" INTEGER,
ADD COLUMN     "promoCodeUsagesCount" INTEGER NOT NULL DEFAULT 0;
