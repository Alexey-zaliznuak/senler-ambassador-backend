import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreatePromoCodeUsageDto {
  @IsString()
  @ApiProperty()
  roomId: string;

  @IsString()
  @ApiProperty()
  promoCode: string;

  @IsString()
  @ApiProperty()
  securityCode: string;

  @IsString()
  @ApiProperty()
  uniqueId: string;
}
