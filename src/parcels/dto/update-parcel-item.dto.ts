import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsNumber } from 'class-validator';

export class UpdateParcelItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity_assigned?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  landed_cost?: number;
}
