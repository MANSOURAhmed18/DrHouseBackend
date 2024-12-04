  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { ValidationPipe } from '@nestjs/common';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: ['http://localhost:50911', 'http://localhost:3000', 'http://localhost:8080'], // Add all your Flutter web ports
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.listen(3000);
  }

  bootstrap();