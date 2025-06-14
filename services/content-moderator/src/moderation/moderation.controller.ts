import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModerationService } from './moderation.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ModerationRequest,
  ModerationResult,
} from './dto/moderation-request.dto';

@ApiTags('Content Moderation')
@Controller('moderate')
export class ModerationController {
  private readonly logger = new Logger(ModerationController.name);

  constructor(private readonly moderationService: ModerationService) {}

  @Post()
  @ApiOperation({
    summary: 'Moderate text and/or image content',
    description: `Analyzes text and/or image content for inappropriate material using AI models:\n
    - Text Analysis: Uses Hugging Face's toxic-bert model to detect toxic language, hate speech, and inappropriate content
    - Image Analysis: Uses NSFW.js to detect inappropriate visual content across multiple categories`,
  })
  @ApiBody({
    description: 'Moderation request body',
    type: ModerationRequest,
    required: true,
    examples: {
      sociallyAcceptable: {
        value: { text: 'This is a test text' },
      },
      sociallyUnacceptable: {
        value: { text: 'This is a test text with fucking swear words bitch !' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Moderation result',
    type: ModerationResult,
  })
  async moderate(@Body() body: ModerationRequest) {
    const { text, imageBase64 } = body;
    return this.moderationService.moderate(text, imageBase64);
  }

  @Post('image')
  @ApiOperation({
    summary: 'Moderate image',
    description: `Analyzes images for inappropriate content using NSFW.js model
    
    The model classifies images into 5 categories:
    - Drawing: Art, cartoons, illustrations
    - Hentai: Anime/manga style explicit content
    - Neutral: Safe for work content
    - Porn: Explicit adult content
    - Sexy: Suggestive but not explicit content
      
    \nThe service provides a safety score between 0 (unsafe) and 1 (safe) based on these classifications.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Moderation result',
    type: ModerationResult,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async moderateImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ModerationResult> {
    try {
      this.logger.debug(
        `Processing file: ${file?.originalname}, size: ${file?.size} bytes`,
      );

      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (!file.buffer) {
        this.logger.error('File buffer is missing');
        throw new BadRequestException('Invalid file format');
      }

      const imageBase64 = file.buffer.toString('base64');
      this.logger.debug(
        `Converted image to base64, length: ${imageBase64.length}`,
      );

      const result = await this.moderationService.moderateImage(imageBase64);
      this.logger.debug('Image moderation completed successfully');

      return {
        details: result.details.reduce(
          (acc, pred) => ({
            ...acc,
            [pred.className.toLowerCase()]: pred.probability,
          }),
          {},
        ),
        score: result.score,
        allowed_for_all_audience: result.score > 0.8,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Error processing image:',
        error instanceof Error ? error.message : String(error),
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new BadRequestException('Error processing image: ' + errorMessage);
    }
  }
}
