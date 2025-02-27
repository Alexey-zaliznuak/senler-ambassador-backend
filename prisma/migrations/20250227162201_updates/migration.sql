/*
  Warnings:

  - You are about to drop the column `cashReward` on the `RewardForReferredUsers` table. All the data in the column will be lost.
  - Added the required column `type` to the `RewardForReferredUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `units` to the `RewardForReferredUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `RewardForReferredUsers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('fix');

-- AlterTable
ALTER TABLE "RewardForReferredUsers" DROP COLUMN "cashReward",
ADD COLUMN     "type" "RewardType" NOT NULL,
ADD COLUMN     "units" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;
