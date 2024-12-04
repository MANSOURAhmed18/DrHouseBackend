// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../schemas/user.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async getDashboardStats() {
        const [
            totalUsers,
            activeUsers,
            inactiveUsers,
            adminUsers,
            superAdminUsers,
            regularUsers
        ] = await Promise.all([
            this.userModel.countDocuments(),
            this.userModel.countDocuments({ isActive: true }),
            this.userModel.countDocuments({ isActive: false }),
            this.userModel.countDocuments({ role: UserRole.ADMIN }),
            this.userModel.countDocuments({ role: UserRole.SUPER_ADMIN }),
            this.userModel.countDocuments({ role: UserRole.USER })
        ]);

        // Get recent users (last 7 days)
        const lastWeekDate = new Date();
        lastWeekDate.setDate(lastWeekDate.getDate() - 7);
        
        const recentUsers = await this.userModel.countDocuments({
            createdAt: { $gte: lastWeekDate }
        });

        return {
            userStats: {
                total: totalUsers,
                active: activeUsers,
                inactive: inactiveUsers,
                newLastWeek: recentUsers
            },
            roleDistribution: {
                superAdmin: superAdminUsers,
                admin: adminUsers,
                regular: regularUsers
            },
            activeInactiveRatio: {
                active: activeUsers,
                inactive: inactiveUsers,
                percentage: totalUsers ? (activeUsers / totalUsers * 100).toFixed(2) : 0
            }
        };
    }
}