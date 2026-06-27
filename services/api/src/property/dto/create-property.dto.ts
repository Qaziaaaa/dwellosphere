import { IsString, IsInt, IsIn, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsInt()
  price!: number;

  @IsIn(['for_sale', 'for_rent'])
  listingType!: string;

  @IsInt()
  beds!: number;

  @IsInt()
  baths!: number;

  @IsInt()
  sqft!: number;

  @IsInt()
  yearBuilt!: number;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  zip!: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsArray()
  images?: any[];

  @IsOptional()
  @IsArray()
  features?: any[];

  @IsOptional()
  @IsArray()
  amenities?: string[];
}
