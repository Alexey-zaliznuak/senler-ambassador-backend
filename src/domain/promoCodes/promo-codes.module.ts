import { Module } from '@nestjs/common';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCodesService } from './promo-codes.service';
import { LoggingModule } from 'src/infrastructure/logging/logging.module';
import { LOGGER_INJECTABLE_NAME } from './promo-codes.config';

@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  imports: [LoggingModule.forFeature(LOGGER_INJECTABLE_NAME)],
})
export class PromoCodesModule {}
