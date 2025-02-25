-- CreateEnum
CREATE TYPE "AmbassadorStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Ambassador" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "promoCode" TEXT,
    "channelTypeId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,

    CONSTRAINT "Ambassador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "pendingSubscriptionId" TEXT NOT NULL,
    "approvedSubscriptionId" TEXT NOT NULL,
    "rejectedSubscriptionId" TEXT NOT NULL,
    "webhookUrls" TEXT[],
    "secretKey" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "senlerChannelId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" DATE,
    "endDate" DATE,
    "promoCode" TEXT NOT NULL,
    "promoCodeUsageLimit" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "rewardIsGiven" BOOLEAN NOT NULL DEFAULT false,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardForReferredUsers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cashReward" INTEGER,
    "sprintId" TEXT NOT NULL,

    CONSTRAINT "RewardForReferredUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorRoom" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "AmbassadorStatus" NOT NULL DEFAULT 'pending',
    "roomId" TEXT NOT NULL,
    "ambassadorId" TEXT NOT NULL,

    CONSTRAINT "AmbassadorRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardForReferredUsers_sprintId_key" ON "RewardForReferredUsers"("sprintId");

-- CreateIndex
CREATE UNIQUE INDEX "AmbassadorRoom_roomId_ambassadorId_key" ON "AmbassadorRoom"("roomId", "ambassadorId");

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardForReferredUsers" ADD CONSTRAINT "RewardForReferredUsers_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorRoom" ADD CONSTRAINT "AmbassadorRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorRoom" ADD CONSTRAINT "AmbassadorRoom_ambassadorId_fkey" FOREIGN KEY ("ambassadorId") REFERENCES "Ambassador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
