import { NestFactory } from '@nestjs/core';
import { AppModule } from './dependencies/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { BadExceptionFilter } from './api/exception.filters/bad.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        throw new BadRequestException(
          errors.map((e) => ({
            field: e.property,
            message: e.constraints[Object.keys(e.constraints)[0]],
          })),
        );
      },
    }),
  );
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalFilters(new BadExceptionFilter());
  await app.listen(3000);
}
bootstrap();
