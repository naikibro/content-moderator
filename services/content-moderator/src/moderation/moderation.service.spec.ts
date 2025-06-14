/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ModerationService } from './moderation.service';
import { HuggingfaceService } from '../huggingface/huggingface.service';
import { ImageService, NSFWPrediction } from '../image/image.service';

interface TextAnalysisResult {
  details: Array<{ label: string; score: number }>;
  score: number;
}

describe('ModerationService', () => {
  let service: ModerationService;
  let huggingfaceService: HuggingfaceService;
  let imageService: ImageService;

  const mockHuggingfaceService = {
    analyzeText: jest.fn(),
  };

  const mockImageService = {
    analyzeImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationService,
        {
          provide: HuggingfaceService,
          useValue: mockHuggingfaceService,
        },
        {
          provide: ImageService,
          useValue: mockImageService,
        },
      ],
    }).compile();

    service = module.get<ModerationService>(ModerationService);
    huggingfaceService = module.get<HuggingfaceService>(HuggingfaceService);
    imageService = module.get<ImageService>(ImageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('moderateText', () => {
    it('should call huggingface service with correct text', async () => {
      const mockResult: TextAnalysisResult = {
        details: [{ label: 'toxic', score: 0.8 }],
        score: 0.8,
      };
      mockHuggingfaceService.analyzeText.mockResolvedValue(mockResult);

      const result = await service.moderateText('test text');
      expect(huggingfaceService.analyzeText).toHaveBeenCalledWith('test text');
      expect(result).toEqual(mockResult);
    });
  });

  describe('moderateImage', () => {
    it('should call image service with correct base64', async () => {
      const mockResult: { score: number; details: NSFWPrediction[] } = {
        details: [
          { className: 'Neutral', probability: 0.9 },
          { className: 'Porn', probability: 0.1 },
        ],
        score: 0.9,
      };
      mockImageService.analyzeImage.mockResolvedValue(mockResult);

      const result = await service.moderateImage('base64string');
      expect(imageService.analyzeImage).toHaveBeenCalledWith('base64string');
      expect(result).toEqual(mockResult);
    });
  });

  describe('moderate', () => {
    it('should process text only', async () => {
      const mockTextResult: TextAnalysisResult = {
        details: [{ label: 'toxic', score: 0.8 }],
        score: 0.8,
      };
      mockHuggingfaceService.analyzeText.mockResolvedValue(mockTextResult);

      const result = await service.moderate('test text');
      expect(result).toEqual({
        details: { toxic: 0.8 },
        score: expect.any(Number),
        allowed_for_all_audience: expect.any(Boolean),
      });
    });

    it('should process image only', async () => {
      const mockImageResult: { score: number; details: NSFWPrediction[] } = {
        details: [
          { className: 'Neutral', probability: 0.9 },
          { className: 'Porn', probability: 0.1 },
        ],
        score: 0.9,
      };
      mockImageService.analyzeImage.mockResolvedValue(mockImageResult);

      const result = await service.moderate(undefined, 'base64string');
      expect(result).toEqual({
        details: {
          neutral: 0.9,
          porn: 0.1,
        },
        score: expect.any(Number),
        allowed_for_all_audience: expect.any(Boolean),
      });
    });

    it('should process both text and image', async () => {
      const mockTextResult: TextAnalysisResult = {
        details: [{ label: 'toxic', score: 0.8 }],
        score: 0.8,
      };
      const mockImageResult: { score: number; details: NSFWPrediction[] } = {
        details: [
          { className: 'Neutral', probability: 0.9 },
          { className: 'Porn', probability: 0.1 },
        ],
        score: 0.9,
      };
      mockHuggingfaceService.analyzeText.mockResolvedValue(mockTextResult);
      mockImageService.analyzeImage.mockResolvedValue(mockImageResult);

      const result = await service.moderate('test text', 'base64string');
      expect(result).toEqual({
        details: {
          toxic: 0.8,
          neutral: 0.9,
          porn: 0.1,
        },
        score: expect.any(Number),
        allowed_for_all_audience: expect.any(Boolean),
      });
    });

    it('should handle empty inputs', async () => {
      const result = await service.moderate();
      expect(result).toEqual({
        details: {},
        score: expect.any(Number),
        allowed_for_all_audience: expect.any(Boolean),
      });
    });
  });
});
