import { Injectable, Logger } from '@nestjs/common';
import { HuggingFaceInference } from '@langchain/community/llms/hf';

@Injectable()
export class LLMProvider {
  private readonly logger = new Logger(LLMProvider.name);
  private client?: HuggingFaceInference;

  constructor() {
    const apiKey = process.env.HF_API_KEY || undefined;
    if (apiKey) {
      this.client = new HuggingFaceInference({
        apiKey,
        model: 'HuggingFaceH4/zephyr-7b-beta',
        maxTokens: 300,
        temperature: 0.7,
      });
    }
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.client) return '';
    try {
      const result = await this.client.invoke(prompt);
      return result.replace(prompt, '').trim();
    } catch (err) {
      this.logger.warn(`LLM generation failed: ${err}`);
      return '';
    }
  }
}
