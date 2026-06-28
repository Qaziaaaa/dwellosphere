import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { RecommendationService } from './recommendation.service';
import { EmbeddingsProvider } from './providers/embeddings.provider';
import { LLMProvider } from './providers/llm.provider';

@Module({
  controllers: [AiController],
  providers: [RecommendationService, EmbeddingsProvider, LLMProvider],
})
export class AiModule {}
