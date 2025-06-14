import { Injectable, Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as nsfwjs from 'nsfwjs';
import * as sharp from 'sharp';

export interface NSFWPrediction {
  className: string;
  probability: number;
}

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  private nsfwModel: nsfwjs.NSFWJS;
  private modelLoaded = false;

  private async loadModel() {
    try {
      if (!this.modelLoaded) {
        this.logger.debug('Loading NSFW model...');
        this.nsfwModel = await nsfwjs.load();
        this.modelLoaded = true;
        this.logger.debug('Model loaded successfully');
      }
    } catch (error) {
      this.logger.error(
        'Error loading model:',
        error instanceof Error ? error.message : String(error),
      );
      throw new Error('Failed to load image analysis model');
    }
  }

  async analyzeImage(
    imageBase64: string,
  ): Promise<{ score: number; details: NSFWPrediction[] }> {
    try {
      await this.loadModel();

      this.logger.debug('Processing image...');
      const buffer = Buffer.from(imageBase64, 'base64');

      // Resize and convert image to RGB
      const processedImage = await sharp(buffer)
        .resize(224, 224, { fit: 'contain' })
        .removeAlpha()
        .raw()
        .toBuffer();

      this.logger.debug('Creating image tensor...');
      const imageTensor = tf.tensor3d(
        new Uint8Array(processedImage),
        [224, 224, 3],
      );

      this.logger.debug('Classifying image...');
      const predictions = await this.nsfwModel.classify(imageTensor);
      imageTensor.dispose();

      // Calculate unsafe score (sum of porn, hentai, sexy)
      const unsafe = predictions
        .filter((p) => ['Porn', 'Hentai', 'Sexy'].includes(p.className))
        .reduce((sum, p) => sum + p.probability, 0);
      const safe = predictions
        .filter((p) => ['Neutral', 'Drawing'].includes(p.className))
        .reduce((sum, p) => sum + p.probability, 0);
      const score = safe / (safe + unsafe);

      this.logger.debug(`Analysis complete. Score: ${score}`);
      return {
        score,
        details: predictions,
      };
    } catch (error) {
      this.logger.error(
        'Error analyzing image:',
        error instanceof Error ? error.message : String(error),
      );
      throw new Error('Failed to analyze image');
    }
  }

  async analyzeManyImages(
    imageBase64s: string[],
  ): Promise<{ score: number; details: NSFWPrediction[] }[]> {
    return Promise.all(
      imageBase64s.map((imageBase64) => this.analyzeImage(imageBase64)),
    );
  }
}
