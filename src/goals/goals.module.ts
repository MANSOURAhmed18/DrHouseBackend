import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { Goal, GoalSchema } from '../schemas/goal.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { GoalProgress, GoalProgressSchema } from '../schemas/goal-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema },
      { name: User.name, schema: UserSchema },
      { name: GoalProgress.name, schema: GoalProgressSchema }
    ])
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService]
})
export class GoalsModule {}