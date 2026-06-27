import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}

export class SimilarDto {
  @IsString()
  propertyId: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}

export class SemanticSearchDto {
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  listingType?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}

export class PricingAdviceDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  listingType?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  beds?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  baths?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sqft?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class ListingGeneratorDto {
  @IsString()
  title: string;

  @IsString()
  propertyType: string;

  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  beds: number;

  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  baths: number;

  @IsInt()
  @Min(100)
  @Type(() => Number)
  sqft: number;

  @IsInt()
  @Type(() => Number)
  yearBuilt: number;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString({ each: true })
  amenities?: string[];
}

export class TrackInteractionDto {
  @IsString()
  propertyId: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  metadata?: string;
}
