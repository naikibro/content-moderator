import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Landing Page',
    description: 'Returns the landing page content as a plain text string.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the landing page content as a plain text string.',
  })
  getLandingPage(): string {
    return this.appService.getLandingPage();
  }
}
