import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ReclamationService } from './reclamation.service';
import { UserRole } from '../schemas/user.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateReclamationDto } from './dto/create-reclamation.dto';
import { UpdateReclamationDto } from './dto/update-reclamation.dto';

@Controller('reclamations')
export class ReclamationController {
    constructor(private readonly reclamationService: ReclamationService) {}

     // Get all reclamations (Admin only)
     @UseGuards(AuthGuard, RolesGuard)
     @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
     @Get()
     getAllReclamations(@Query('status') status?: string, @Query('user') user?: string) {
         return this.reclamationService.getAllReclamations({ status, user });
     }

    // User creating a reclamation
    @Post()
    createReclamation(@Body() createReclamationDto: CreateReclamationDto) {
        return this.reclamationService.createReclamation(createReclamationDto);
    }

    // Admin updating a reclamation
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Put(':id')
    updateReclamation(
        @Param('id') id: string,
        @Body() updateReclamationDto: UpdateReclamationDto,
    ) {
        return this.reclamationService.updateReclamation(id, updateReclamationDto);
    }
}
