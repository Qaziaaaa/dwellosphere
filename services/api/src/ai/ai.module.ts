import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { RecommendationService } from './recommendation.service';
import { EmbeddingService } from './embedding.service';
import { HuggingFaceService } from './huggingface.service';

@Module({
  controllers: [AiController],
  providers: [RecommendationService, EmbeddingService, HuggingFaceService],
})
export class AiModule {}
