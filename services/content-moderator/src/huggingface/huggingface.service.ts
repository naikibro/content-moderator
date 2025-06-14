import { Injectable } from '@nestjs/common';

interface TextClassificationResult {
  label: string;
  score: number;
}

interface Pipeline {
  (task: string, model: string): Promise<TextClassifier>;
}

interface TextClassifier {
  (text: string): Promise<TextClassificationResult[]>;
}

@Injectable()
export class HuggingfaceService {
  private textModel: TextClassifier;
  private pipeline: Pipeline;
  private modelLoaded = false;

  private async loadModel() {
    if (!this.modelLoaded) {
      const transformers = await import('@xenova/transformers');
      this.pipeline = transformers.pipeline as Pipeline;
      this.textModel = await this.pipeline(
        'text-classification',
        'Xenova/toxic-bert',
      );
      this.modelLoaded = true;
    }
  }

  async analyzeText(
    text: string,
  ): Promise<{ score: number; details: TextClassificationResult[] }> {
    await this.loadModel();
    const result = await this.textModel(text);
    // Assume result[0].score is the toxicity probability
    return {
      score: result[0].score,
      details: result,
    };
  }
}
