import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

interface TextClassificationResult {
  label: string;
  score: number;
}

@Injectable()
export class HuggingfaceService {
  constructor(private readonly httpService: HttpService) {}

  async analyzeText(
    text: string,
  ): Promise<{ score: number; details: TextClassificationResult[] }> {
    const response$ = this.httpService.post(
      'http://content-moderator-python:8000/moderate',
      { text },
      { headers: { 'Content-Type': 'application/json' } },
    );
    const response = await lastValueFrom(response$);
    return response.data as {
      score: number;
      details: TextClassificationResult[];
    };
  }
}
