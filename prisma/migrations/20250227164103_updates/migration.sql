/*
  Warnings:

  - You are about to drop the column `units` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Sprint` table. All the data in the column will be lost.
  - Added the required column `rewardUnits` to the `Sprint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rewardValue` to the `Sprint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "units",
DROP COLUMN "value",
ADD COLUMN     "rewardUnits" TEXT NOT NULL,
ADD COLUMN     "rewardValue" INTEGER NOT NULL;
