import { IsOptional, IsString, IsInt, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPropertyDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['for_sale', 'for_rent'])
  listingType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minBeds?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'newest', 'sqft_desc'])
  sort?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
