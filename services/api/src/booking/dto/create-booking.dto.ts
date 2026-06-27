import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  propertyId!: string;

  @IsDateString()
  date!: string;

  @IsString()
  timeSlot!: string;

  @IsOptional()
  @IsString()
  message?: string;
}
