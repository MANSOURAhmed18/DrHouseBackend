import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { HttpModule } from '@nestjs/axios';
import { SymptomSearch, SymptomSearchSchema } from 'src/schemas/symptom.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [HttpModule,
    MongooseModule.forFeature([
      { name: SymptomSearch.name, schema: SymptomSearchSchema }
  ])
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
