import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CustomRequest } from 'src/infrastructure/requests';
import { CreatePromoCodeUsageDto } from './dto/use-promo-code.dto';
import { PromoCodesService } from './promo-codes.service';

@Controller('promo-code')
export class PromoCodesController {
  constructor(private readonly promoCodeService: PromoCodesService) {}

  @Post('use')
  @ApiBody({ type: CreatePromoCodeUsageDto })
  async usePromoCode(@Body() dto: CreatePromoCodeUsageDto) {
    return this.promoCodeService.usePromoCode(dto);
  }

  @Post('testWebhook')
  async testWebhook(@Request() req: CustomRequest, @Body() body: any): Promise<{ success: boolean }> {
    req.logger.info('Webhook received', body);
    return { success: true };
  }
}
