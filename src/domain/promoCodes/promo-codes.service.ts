import { BadGatewayException, BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventType } from '@prisma/client';
import { AXIOS, CustomAxiosInstance } from 'src/infrastructure/axios/instance';
import { PRISMA } from 'src/infrastructure/database/database.config';
import { PrismaExtendedClientType } from 'src/infrastructure/database/database.service';
import { Logger } from 'winston';
import { CreatePromoCodeUsageDto } from './dto/use-promo-code.dto';
import { LOGGER_INJECTABLE_NAME } from './promo-codes.config';

@Injectable()
export class PromoCodesService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaExtendedClientType,
    @Inject(AXIOS) private readonly axios: CustomAxiosInstance,
    @Inject(LOGGER_INJECTABLE_NAME) private readonly logger: Logger
  ) {}

  async usePromoCode(dto: CreatePromoCodeUsageDto) {
    const { roomId, promoCode, uniqueId, securityCode } = dto;
    const currentDate = new Date();

    let activeSprint = await this.prisma.sprint.findFirst({
      where: {
        roomId,
        isDeleted: false,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
      include: { room: true },
    });

    if (!activeSprint) {
      activeSprint = await this.prisma.sprint.findFirst({
        where: {
          roomId,
          isDeleted: false,
          startDate: { lte: currentDate },
          endDate: null,
        },
        include: { room: true },
      });
    }

    if (!activeSprint) throw new BadRequestException('No active sprints found');

    const ambassador = await this.prisma.ambassador.findFirst({
      where: { promoCode, isDeleted: false },
    });
    if (!ambassador) {
      throw new BadRequestException('Promo code not found');
    }

    return await this.prisma.$transaction(async transaction => {
      if (activeSprint.promoCodeUsageLimit && activeSprint.promoCodeUsagesCount >= activeSprint.promoCodeUsageLimit) {
        throw new BadRequestException('Promo code usage limit has been reached');
      }

      const existingUsage = await transaction.event.findFirst({
        where: {
          type: EventType.promoCodeUsage,
          sprintId: activeSprint.id,
          uniqueId,
          ambassadorId: ambassador.id,
        },
      });

      if (existingUsage) throw new BadRequestException('Promo code already usage');

      await transaction.event.create({
        data: {
          type: EventType.promoCodeUsage,
          sprintId: activeSprint.id,
          ambassadorId: ambassador.id,
          uniqueId,
        },
      });

      const axiosResponse = await this.axios.post<{ success?: true }>(
        activeSprint.room.webhookUrl,
        {
          value: promoCode,
          reward: {
            type: activeSprint.rewardType,
            value: activeSprint.rewardValue,
            units: activeSprint.rewardUnits,
          },
        },
        {
          params: {
            channel_id: activeSprint.room.senlerChannelId,
            room_id: roomId,
            sprint_id: activeSprint.id,
            ambassador_id: ambassador.id,
            secret_key: activeSprint.room.secretKey,
            securityCode: securityCode,
            action: 'promocode_activate',
            unique_id: uniqueId,
          },
          validateStatus: _status => true,
        }
      );

      if (axiosResponse.data.success === true) {
        await transaction.sprint.updateWithCacheInvalidate({
          where: { id: activeSprint.id },
          data: { promoCodeUsagesCount: { increment: 1 } },
        });
      } else {
        throw new BadGatewayException(axiosResponse.data, 'Can not apply promocode: external service not available');
      }

      return {
        rewardType: activeSprint.rewardType,
        rewardUnits: activeSprint.rewardUnits,
        rewardValue: activeSprint.rewardValue,
      };
    });
  }
}
