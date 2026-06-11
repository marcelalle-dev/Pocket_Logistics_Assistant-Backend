import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateExchangeRateDto {
  @IsString()
  @IsNotEmpty()
  from_currency: string;

  @IsString()
  @IsNotEmpty()
  to_currency: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rate: number;
}
