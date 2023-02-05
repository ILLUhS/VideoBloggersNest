import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class BadExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse: any = exception.getResponse();
    const errorsMessages = [];

    if (status === 400) {
      errorResponse.message.forEach((m) => {
        errorsMessages.push(m);
      });
      response.status(status).json({ errorsMessages });
    }
  }
}
