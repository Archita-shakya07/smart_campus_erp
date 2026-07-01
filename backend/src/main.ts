import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  await app.listen(process.env.PORT ?? 5000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 5000}`);
}

bootstrap().catch(err => console.error(err));
