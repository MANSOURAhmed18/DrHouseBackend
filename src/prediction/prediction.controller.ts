import { Controller, Post, Body, HttpException, HttpStatus, Logger, Get, Query } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Controller('prediction')
export class PredictionController {
  private readonly logger = new Logger(PredictionController.name);

  constructor(private readonly predictionService: PredictionService) {}

  @Post('symptoms')
  async getPrediction(@Body('symptoms') symptoms: string[]) {
    // Log the incoming symptoms data
    this.logger.log(`Received symptoms: ${JSON.stringify(symptoms)}`);
    await this.predictionService.trackSymptomSearch(symptoms);

    // Validate that symptoms is a non-empty array
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      this.logger.error('Validation failed: Symptoms must be a non-empty array.');
      throw new HttpException('Symptoms must be a non-empty array.', HttpStatus.BAD_REQUEST);
    }

    // Log before calling the service
    this.logger.log('Passing symptoms to the service for prediction.');

    const result = await this.predictionService.getPrediction(symptoms);

    // Log the response from the service
    this.logger.log(`Prediction result: ${JSON.stringify(result)}`);
    
    return result;
  }

  @Get('most-searched')
  async getMostSearchedSymptoms(
      @Query('limit') limit: number = 10
  ) {
      return this.predictionService.getMostSearchedSymptoms(limit);
  }
}
