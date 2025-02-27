import { IsString, IsNumber } from 'class-validator';

export class CreatePromoCodeUsageDto {
  @IsString()
  roomId: string;

  @IsString()
  promoCode: string;

  @IsString()
  securityCode: string;

  @IsString()
  uniqueId: string;
}
