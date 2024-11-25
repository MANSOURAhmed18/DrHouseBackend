import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './services/mail.service';
import { PredictionModule } from './prediction/prediction.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { GoalsModule } from './goals/goals.module';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/Backend'),
    JwtModule.register({ global: true, secret: '123' }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'samimahjoub090@gmail.com', // Hardcoded sender email
          pass: 'your-app-password', // Gmail app password
        },
      },
      defaults: {
        from: '"No Reply" <samimahjoub090@gmail.com>', // Default sender info
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    PredictionModule,
    ProductModule,
    CategoryModule,
    GoalsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
