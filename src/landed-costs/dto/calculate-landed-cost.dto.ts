import { IsArray, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @IsNumber()
  unit_price: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  landed_cost_percent?: number; // percent (e.g. 10 for 10%)
}

export class CalculateLandedCostDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  additional_fees?: number;
}
