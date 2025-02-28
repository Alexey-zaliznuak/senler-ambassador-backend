import { LoggingService } from "src/infrastructure/logging/logging.service";

export const PROMO_CODES = 'promoCodes';
export const LOGGER_INJECTABLE_NAME = LoggingService.buildInjectableNameByContext(PROMO_CODES);
