import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ParcelStatus } from '@prisma/client';

export class CreateParcelDto {
  @IsString()
  @IsNotEmpty()
  tracking_code: string;

  @IsOptional()
  @IsEnum(ParcelStatus)
  status?: ParcelStatus;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  trip_id?: number;
}
