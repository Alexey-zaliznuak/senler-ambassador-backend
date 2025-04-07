import { Body, Controller, Inject, Post, Request } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { PRISMA } from 'src/infrastructure/database/database.config';
import { PrismaExtendedClientType } from 'src/infrastructure/database/database.service';
import { CustomRequest } from 'src/infrastructure/requests';
import { CreatePromoCodeUsageDto } from './dto/use-promo-code.dto';
import { PromoCodesService } from './promo-codes.service';

@Controller('promo-code')
export class PromoCodesController {
  constructor(
    private readonly promoCodeService: PromoCodesService,
    @Inject(PRISMA) private readonly prisma: PrismaExtendedClientType
  ) {}

  @Post('use')
  @ApiBody({ type: CreatePromoCodeUsageDto })
  async usePromoCode(@Body() dto: CreatePromoCodeUsageDto) {
    return await this.promoCodeService.usePromoCode(dto);
  }

  @Post('testWebhook')
  async testWebhook(@Request() req: CustomRequest, @Body() body: any): Promise<any> {
    return await {success: true}
  }
}
