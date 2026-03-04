import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('/medical-advice')
  async getMedicalAdvice(@Body() input: { symptoms: string }) {
    return this.aiService.getMedicalAdvice(input.symptoms || '');
  }
}
