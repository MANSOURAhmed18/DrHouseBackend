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
import { GoalsModule } from './goals/goals.module';
import { TrackingModule } from './tracking/tracking.module';
import { ProgressModule } from './progress/progress.module';
import { OcrModule } from './ocr/ocr.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { AdminModule } from './admin/admin.module';
import { ReclamationModule } from './reclamation/reclamation.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
@Module({
  imports: [
    // ServeStaticModule for serving static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to uploads directory
      serveRoot: '/uploads', // URL prefix for accessing static files
    }),
    MulterModule.register({
      dest: './uploads', // Temporary storage for uploaded files
    }),
    
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
    GoalsModule,
    TrackingModule,
    ProgressModule,
    OcrModule,
    AuthModule,
    AdminModule,
    ReclamationModule,
    OrderModule,
    PaymentModule,
    
    
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
