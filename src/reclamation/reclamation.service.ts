import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Reclamation } from '../schemas/reclamation.schema';
import { CreateReclamationDto } from './dto/create-reclamation.dto';
import { UpdateReclamationDto } from './dto/update-reclamation.dto';

@Injectable()
export class ReclamationService {
    constructor(
        @InjectModel(Reclamation.name) private readonly reclamationModel: Model<Reclamation>,
    ) {}

    // Create a new reclamation
    async createReclamation(createReclamationDto: CreateReclamationDto): Promise<Reclamation> {
        const reclamation = new this.reclamationModel(createReclamationDto);
        return reclamation.save();
    }

    // Update a reclamation (Admin only)
    async updateReclamation(
        id: string,
        updateReclamationDto: UpdateReclamationDto,
    ): Promise<Reclamation> {
        const reclamation = await this.reclamationModel.findById(id);
        if (!reclamation) {
            throw new NotFoundException('Reclamation not found');
        }

        Object.assign(reclamation, updateReclamationDto);

        if (updateReclamationDto.status === 'resolved') {
            reclamation.resolvedAt = new Date();
        }

        return reclamation.save();
    }

        // Get all reclamations with optional filters
        async getAllReclamations(filters: { status?: string; user?: string }): Promise<Reclamation[]> {
          const query: FilterQuery<Reclamation> = {};
  
          if (filters.status) {
              query.status = filters.status;
          }
  
          if (filters.user) {
              query.user = filters.user;
          }
  
          return this.reclamationModel.find(query).populate('user', 'name email').exec();
      }
  
}
