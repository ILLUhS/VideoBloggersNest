import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
@Catch(BadRequestException)
export class BadExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse: any = exception.getResponse();
    const errorsMessages = [];

    errorResponse.message.forEach((m) => {
      errorsMessages.push(m);
    });
    response.status(status).json({ errorsMessages });
  }
}
