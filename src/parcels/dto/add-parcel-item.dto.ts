import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  Min,
  IsNumber,
} from 'class-validator';

export class AddParcelItemDto {
  @Type(() => Number)
  @IsInt()
  item_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity_assigned: number;

  @Type(() => Number)
  @IsNumber()
  landed_cost: number;
}
