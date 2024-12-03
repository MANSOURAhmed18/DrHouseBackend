import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';  // For handling Observable to Promise
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PredictionService {
  private readonly flaskApiUrl = 'http://127.0.0.1:5000/api/predict'; // Flask API URL

  constructor(private readonly httpService: HttpService) {}

  async getPrediction(symptoms: string[]): Promise<any> {
    // Check if symptoms is an array and is not empty
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      throw new HttpException('Symptoms must be a non-empty array', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post(this.flaskApiUrl, { symptoms: symptoms.join(', ') })
      );

      return response.data; // Return the prediction response from Flask API
    } catch (error) {
      console.error('Error calling Flask API:', error);

      // Handle the error based on response or network issue
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error getting prediction from the model.',
          HttpStatus.BAD_REQUEST
        );
      } else {
        throw new HttpException(
          'Error calling Flask API',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
