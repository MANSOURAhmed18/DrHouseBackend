// src/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('dashboard-stats')
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
}