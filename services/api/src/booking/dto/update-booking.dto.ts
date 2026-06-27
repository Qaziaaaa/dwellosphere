import { IsIn } from 'class-validator';

export class UpdateBookingDto {
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status!: string;
}
