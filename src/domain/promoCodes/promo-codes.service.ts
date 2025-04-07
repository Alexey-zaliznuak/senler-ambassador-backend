import { BadGatewayException, BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventType } from '@prisma/client';
import { AXIOS, AxiosService } from 'src/infrastructure/axios/instance';
import { PRISMA } from 'src/infrastructure/database/database.config';
import { PrismaExtendedClientType } from 'src/infrastructure/database/database.service';
import { Logger } from 'winston';
import { CreatePromoCodeUsageDto } from './dto/use-promo-code.dto';
import { LOGGER_INJECTABLE_NAME } from './promo-codes.config';

@Injectable()
export class PromoCodesService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaExtendedClientType,
    @Inject(AXIOS) private readonly axios: AxiosService,
    @Inject(LOGGER_INJECTABLE_NAME) private readonly logger: Logger
  ) {}

  async usePromoCode(dto: CreatePromoCodeUsageDto) {
    const { roomId, promoCode, uniqueId, securityCode } = dto;
    const currentDate = new Date();

    this.logger.error("AMBASSADOr", {
      where: { promoCode, isDeleted: false },
      prisma: this.prisma.ambassador.findFirst({where: {promoCode, isDeleted: false}}),
      prisma2: this.prisma.ambassador.findFirst({where: {promoCode}})
    })

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

    // todo - UPDATE CACHE MODULE
    const ambassador = await this.prisma.ambassador.findFirstOrThrow({
      where: { promoCode, isDeleted: false },
    });

    return await this.prisma.$transaction(async transaction => {
      const currentSprint = await transaction.sprint.findUnique({
        where: { id: activeSprint.id },
        include: { room: true },
      });

      if (
        currentSprint !== null &&
        currentSprint.promoCodeUsageLimit &&
        currentSprint.promoCodeUsagesCount >= currentSprint.promoCodeUsageLimit
      ) {
        throw new BadRequestException('Promo code usage limit has been reached.');
      }

      const existingUsage = await transaction.event.findFirst({
        where: {
          type: EventType.promoCodeUsage,
          sprintId: activeSprint.id,
          uniqueId,
          ambassadorId: ambassador.id,
        },
      });

      if (existingUsage) throw new BadRequestException('Promo code already usage.');

      await transaction.event.create({
        data: {
          type: EventType.promoCodeUsage,
          sprintId: activeSprint.id,
          ambassadorId: ambassador.id,
          uniqueId,
        },
      });

      const axiosResponse = await this.axios.post<{ success?: true }>(
        currentSprint.room.webhookUrl,
        {
          value: promoCode,
          reward: {
            type: currentSprint.rewardType,
            value: currentSprint.rewardValue,
            units: currentSprint.rewardUnits,
          },
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
          validateStatus: _status => true,
        }
      );

      if (axiosResponse.data.success === true) {
        await transaction.sprint.updateWithCacheInvalidate({
          where: { id: activeSprint.id },
          data: { promoCodeUsagesCount: { increment: 1 } },
        });
      } else {
        throw new BadGatewayException(axiosResponse.data, "Can not apply promocode: external service not available");
      }

      return {
        rewardType: currentSprint.rewardType,
        rewardUnits: currentSprint.rewardUnits,
        rewardValue: currentSprint.rewardValue,
      };
    });
  }
}
