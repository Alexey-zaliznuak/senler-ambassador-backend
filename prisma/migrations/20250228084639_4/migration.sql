/*
  Warnings:

  - You are about to drop the column `data` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "data",
ADD COLUMN     "payload" JSONB;
