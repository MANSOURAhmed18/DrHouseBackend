import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RefreshToken, RefreshTokenSchema } from 'src/schemas/refresh-token.schema';
import { ResetToken, ResetTokenSchema } from 'src/schemas/reset-token.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MailModule } from './mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
      
    ]),
    MailModule,
    
  ],
  providers: [
    AuthService,
    AuthGuard,
    RolesGuard
  ],
  controllers: [AuthController],
  exports: [AuthGuard, RolesGuard],
})
export class AuthModule {}