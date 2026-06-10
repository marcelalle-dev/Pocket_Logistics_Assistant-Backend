import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
