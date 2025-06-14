import { Injectable } from '@nestjs/common';
import { HuggingfaceService } from '../huggingface/huggingface.service';
import { ImageService, NSFWPrediction } from '../image/image.service';
import { computeScore } from '../utils/scoring';

interface TextAnalysisResult {
  details: Array<{ label: string; score: number }>;
  score: number;
}

@Injectable()
export class ModerationService {
  constructor(
    private readonly huggingfaceService: HuggingfaceService,
    private readonly imageService: ImageService,
  ) {}

  async moderateText(text: string): Promise<TextAnalysisResult> {
    return this.huggingfaceService.analyzeText(text);
  }

  async moderateImage(
    imageBase64: string,
  ): Promise<{ score: number; details: NSFWPrediction[] }> {
    return this.imageService.analyzeImage(imageBase64);
  }

  async moderate(text?: string, imageBase64?: string) {
    const details: Record<string, number> = {};
    let textResult: TextAnalysisResult | undefined;
    let imageResult: { score: number; details: NSFWPrediction[] } | undefined;

    if (text) {
      textResult = await this.moderateText(text);
      Object.assign(
        details,
        textResult.details[0]?.label
          ? { [textResult.details[0].label]: textResult.details[0].score }
          : {},
      );
    }
    if (imageBase64) {
      imageResult = await this.moderateImage(imageBase64);
      if (Array.isArray(imageResult.details)) {
        for (const pred of imageResult.details) {
          details[pred.className.toLowerCase()] = pred.probability;
        }
      }
    }
    const score = computeScore(details);
    return {
      details,
      score,
      allowed_for_all_audience: score > 0.8,
    };
  }
}
