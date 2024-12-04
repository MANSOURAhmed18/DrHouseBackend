// src/scripts/create-super-admin.ts
import { MongooseModule } from '@nestjs/mongoose';
import { NestFactory } from '@nestjs/core';
import { User, UserRole, UserSchema } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Module } from '@nestjs/common';

// Direct MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/Backend';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
class SeedModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(SeedModule);

    const userModel = app.get('UserModel');

    // Check if super admin already exists
    const superAdminExists = await userModel.findOne({ role: UserRole.SUPER_ADMIN });
    
    if (superAdminExists) {
      console.log('Super admin already exists');
      await app.close();
      process.exit(0);
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
    
    await userModel.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      isFirstLogin: false
    });

    console.log('Super admin created successfully');
    
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
}

bootstrap();