import { IsOptional, IsString } from 'class-validator';

export class ModerationRequest {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  imageBase64?: string;
}

export class ModerationResult {
  details: Record<string, number>;
  score: number;
  allowed_for_all_audience: boolean;
}
