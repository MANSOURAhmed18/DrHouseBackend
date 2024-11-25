// goals.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { Goal, GoalSchema } from '../schemas/goal.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }, { name: User.name, schema: UserSchema }]),
  ],
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}