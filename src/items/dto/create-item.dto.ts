import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  unit_price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @Type(() => Number)
  @IsNumber()
  exchange_rate_at_purchase: number;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;

  @Type(() => Number)
  @IsInt()
  category_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  trip_id?: number;
}
