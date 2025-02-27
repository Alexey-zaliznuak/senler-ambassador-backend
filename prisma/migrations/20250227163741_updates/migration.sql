/*
  Warnings:

  - You are about to drop the column `rewardIsGiven` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the `RewardForReferredUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rewardType` to the `Sprint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `units` to the `Sprint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Sprint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RewardForReferredUsers" DROP CONSTRAINT "RewardForReferredUsers_sprintId_fkey";

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "rewardIsGiven",
ADD COLUMN     "rewardType" "RewardType" NOT NULL,
ADD COLUMN     "units" TEXT NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL;

-- DropTable
DROP TABLE "RewardForReferredUsers";
