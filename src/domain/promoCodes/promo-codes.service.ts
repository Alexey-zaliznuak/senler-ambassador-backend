import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AXIOS, AxiosService } from 'src/infrastructure/axios/instance';
import { PRISMA } from 'src/infrastructure/database/database.config';
import { ExtendedPrismaClientType } from 'src/infrastructure/database/database.service';
import { CreatePromoCodeUsageDto } from './dto/use-promo-code.dto';

@Injectable()
export class PromoCodesService {
  constructor(
    @Inject(PRISMA) private readonly prisma: ExtendedPrismaClientType,
    @Inject(AXIOS) private readonly axios: AxiosService
  ) {}

  async usePromoCode(dto: CreatePromoCodeUsageDto) {
    const { roomId, promoCode, uniqueId, securityCode } = dto;
    const currentDate = new Date();

    let activeSprint = await this.prisma.sprint.findFirstWithCache({
      where: {
        roomId,
        isDeleted: false,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
    });

    if (!activeSprint) {
      activeSprint = await this.prisma.sprint.findFirstWithCache({
        where: {
          roomId,
          isDeleted: false,
          startDate: { lte: currentDate },
          endDate: null,
        },
      });
    }

    if (!activeSprint) throw new BadRequestException('No active sprints found');

    const ambassador = await this.prisma.ambassador.findFirstOrThrowWithCache({
      where: { promoCode, isDeleted: false },
    });

    return this.prisma.$transaction(async transaction => {
      const currentSprint = await transaction.sprint.findUnique({
        where: { id: activeSprint.id },
        include: { room: true },
      });

      if (currentSprint !== null && currentSprint.promoCodeUsagesCount >= currentSprint.promoCodeUsageLimit) {
        throw new BadRequestException('Promo code usage limit has been reached.');
      }

      const existingUsage = await transaction.promoCodeUsage.findFirst({
        where: {
          sprintId: activeSprint.id,
          uniqueId,
          ambassadorId: ambassador.id,
        },
      });

      if (existingUsage) throw new BadRequestException('Promo code already usage.');

      await transaction.promoCodeUsage.create({
        data: {
          sprintId: activeSprint.id,
          ambassadorId: ambassador.id,
          uniqueId,
        },
      });

      await Promise.all([
        transaction.sprint.updateWithCacheInvalidate({
          where: { id: activeSprint.id },
          data: { promoCodeUsagesCount: { increment: 1 } },
        }),
        this.axios.post(
          currentSprint.room.webhookUrl,
          {
            value: promoCode,
            reward: {
              type: currentSprint.rewardType,
              value: currentSprint.rewardValue,
              units: currentSprint.rewardUnits
            }
          },
          {
            params: {
              channel_id: currentSprint.room.senlerChannelId,
              room_id: roomId,
              sprint_id: currentSprint.id,
              ambassador_id: ambassador.id,
              secret_key: currentSprint.room.secretKey,
              securityCode: securityCode,
              action: 'promocode_activate',
              unique_id: uniqueId,
            },
          }
        ),
      ]);

      return { success: true };
    });
  }
}
