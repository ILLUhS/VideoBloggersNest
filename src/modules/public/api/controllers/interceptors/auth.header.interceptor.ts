import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req.headers.authorization) {
      if (req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString('ascii'),
        );
        req.user = { userId: payload.userId };
      }
    } else req.user = {};
    return next.handle().pipe();
  }
}
