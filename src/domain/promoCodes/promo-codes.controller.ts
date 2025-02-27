import { Body, Controller, Post } from '@nestjs/common';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeUsageDto } from './dto/use-promo-code.dto';

@Controller('promo-code')
export class PromoCodesController {
  constructor(private readonly promoCodeService: PromoCodesService) {}

  @Post('use')
  async usePromoCode(@Body() dto: CreatePromoCodeUsageDto) {
    return this.promoCodeService.usePromoCode(dto);
  }
}
