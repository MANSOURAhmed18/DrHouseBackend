import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';  // For handling Observable to Promise
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SymptomSearch } from 'src/schemas/symptom.schema';
import { Model } from 'mongoose';

@Injectable()
export class PredictionService {
  private readonly flaskApiUrl = 'http://127.0.0.1:5000/api/predict'; // Flask API URL
  private readonly logger = new Logger(PredictionService.name);

  constructor(private readonly httpService: HttpService,
    @InjectModel(SymptomSearch.name)
        private symptomSearchModel: Model<SymptomSearch>
  ) {}

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

  async trackSymptomSearch(symptoms: string[] | string): Promise<void> {
    try {
        // Convert to array if string
        const symptomsArray = Array.isArray(symptoms) 
            ? symptoms 
            : typeof symptoms === 'string' 
                ? [symptoms]
                : [];

        // Validate array
        if (!symptomsArray.length) {
            throw new HttpException(
                'Invalid symptoms format',
                HttpStatus.BAD_REQUEST
            );
        }

        // Sort and store
        const sortedSymptoms = symptomsArray
            .filter(symptom => typeof symptom === 'string')
            .map(symptom => symptom.toLowerCase().trim())
            .sort();

        await this.symptomSearchModel.findOneAndUpdate(
            { symptoms: sortedSymptoms },
            { $inc: { searchCount: 1 } },
            { upsert: true, new: true }
        );
    } catch (error) {
        this.logger.error(`Error tracking symptoms: ${error.message}`);
        throw error;
    }
}


async getMostSearchedSymptoms(limit: number) {
    return this.symptomSearchModel
        .find()
        .sort({ searchCount: -1 })
        .limit(limit)
        .select('symptoms searchCount -_id')
        .exec();
}
}
