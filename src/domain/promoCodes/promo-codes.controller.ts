import { Body, Controller, Post, Request } from '@nestjs/common';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeUsageDto } from './dto/use-promo-code.dto';
import { CustomRequest } from 'src/infrastructure/requests';

@Controller('promo-code')
export class PromoCodesController {
  constructor(private readonly promoCodeService: PromoCodesService) {}

  @Post('use')
  async usePromoCode(@Body() dto: CreatePromoCodeUsageDto) {
    return this.promoCodeService.usePromoCode(dto);
  }

  @Post('testWebhook')
  async testWebhook(@Request() req: CustomRequest, @Body() body: any) {
    req.logger.info("Webhook received", body);
  }
}
