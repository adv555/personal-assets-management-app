import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Fintech Manager')
    .setDescription('Assets Manager API Documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // only allow properties defined in the DTO
      forbidNonWhitelisted: true, // throw an error if a property is not defined in the DTO
      transform: true, // transform the payload to the DTO type

      transformOptions: {
        enableImplicitConversion: true, // convert string to number
      },
    }),
  );
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });

  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
