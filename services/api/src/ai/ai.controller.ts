import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Param,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecommendationService } from './recommendation.service';
import {
  RecommendationDto,
  SimilarDto,
  SemanticSearchDto,
  PricingAdviceDto,
  ListingGeneratorDto,
  TrackInteractionDto,
} from './dto/ai-query.dto';

@Controller('api/v1/ai')
export class AiController {
  constructor(private readonly recommendation: RecommendationService) {}

  @Get('recommendations')
  @UseGuards(AuthGuard('jwt'))
  async getRecommendations(@Req() req: any, @Query() query: RecommendationDto) {
    return this.recommendation.getRecommendationsForUser(
      req.user.id,
      query.limit || 6,
    );
  }

  @Get('similar/:propertyId')
  async getSimilar(
    @Param() params: SimilarDto,
    @Query() query: RecommendationDto,
  ) {
    return this.recommendation.getSimilarProperties(
      params.propertyId,
      query.limit || 6,
    );
  }

  @Get('search')
  async semanticSearch(@Query() query: SemanticSearchDto) {
    return this.recommendation.semanticSearch(
      query.q,
      { listingType: query.listingType },
      query.limit || 12,
    );
  }

  @Post('pricing-advisor')
  async pricingAdvice(
    @Body(new ValidationPipe({ transform: true })) dto: PricingAdviceDto,
  ) {
    return this.recommendation.pricingAdvice(dto);
  }

  @Post('listing-generator')
  @UseGuards(AuthGuard('jwt'))
  async generateListing(
    @Body(new ValidationPipe({ transform: true })) dto: ListingGeneratorDto,
  ) {
    return this.recommendation.generateListingDescription(dto);
  }

  @Post('track-interaction')
  @UseGuards(AuthGuard('jwt'))
  async trackInteraction(@Req() req: any, @Body() dto: TrackInteractionDto) {
    return this.recommendation.trackInteraction(
      req.user.id,
      dto.propertyId,
      dto.type,
      dto.metadata,
    );
  }

  @Get('trending')
  async getTrending() {
    return this.recommendation.getSimilarProperties('seed-prop-1', 6);
  }
}
