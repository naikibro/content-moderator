import { Test, TestingModule } from '@nestjs/testing';
import { HuggingfaceService } from './huggingface.service';

jest.mock('@xenova/transformers', () => ({
  pipeline: jest.fn().mockResolvedValue(mockTextClassifier),
}));

const mockTextClassifier = jest.fn().mockResolvedValue([
  { label: 'toxic', score: 0.8 },
  { label: 'safe', score: 0.2 },
]);

describe('HuggingfaceService', () => {
  let service: HuggingfaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HuggingfaceService],
    }).compile();

    service = module.get<HuggingfaceService>(HuggingfaceService);
    jest.clearAllMocks();
  });

  describe('analyzeText', () => {
    it('should load model on first call', async () => {
      const result = await service.analyzeText('test text');
      expect(result).toEqual({
        score: 0.8,
        details: [
          { label: 'toxic', score: 0.8 },
          { label: 'safe', score: 0.2 },
        ],
      });
    });

    it('should reuse loaded model on subsequent calls', async () => {
      await service.analyzeText('first call');
      await service.analyzeText('second call');
      expect(mockTextClassifier).toHaveBeenCalledTimes(2);
    });

    it('should handle different text inputs', async () => {
      const result = await service.analyzeText('different text');
      expect(result.score).toBeDefined();
      expect(result.details).toHaveLength(2);
    });
  });
});
