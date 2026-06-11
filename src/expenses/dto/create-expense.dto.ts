import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';

export class CreateExpenseDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount_cfa: number;

  @IsString()
  @IsNotEmpty()
  expense_type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsInt()
  trip_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parcel_id?: number;
}
