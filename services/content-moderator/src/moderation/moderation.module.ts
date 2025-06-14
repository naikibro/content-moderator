import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { HuggingfaceService } from '../huggingface/huggingface.service';
import { ImageService } from '../image/image.service';

@Module({
  imports: [HttpModule],
  controllers: [ModerationController],
  providers: [ModerationService, HuggingfaceService, ImageService],
  exports: [ModerationService, HuggingfaceService, ImageService],
})
export class ModerationModule {}
