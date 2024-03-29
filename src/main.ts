import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import * as morgan from 'morgan';
import 'winston-daily-rotate-file'
import { MetricsMiddleware } from './metrics/metrics.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER)

  app.useLogger(logger)

  app.use(
    morgan('combined', {
    stream: {
      write: (message) => logger.log(message),
    },
  },MetricsMiddleware));
  
  
  app.useGlobalPipes(new ValidationPipe(), );
  const config = new DocumentBuilder()
    .setTitle('Voiture API')
    .setDescription('UNe api pour gérer des références de marques de voiture')
    .setVersion('1.0')
    .addTag('voitures')
    .build();
  const document = SwaggerModule.createDocument(app, config);


  SwaggerModule.setup('api', app, document)
  await app.listen(3500);
}
bootstrap();