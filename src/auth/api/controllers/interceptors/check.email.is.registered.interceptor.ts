import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../application/services/auth.service';

@Injectable()
export class CheckEmailIsRegisteredInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const userId = await this.authService.findUserByField(
      'email',
      req.body.email,
    );
    if (!userId)
      throw new BadRequestException({
        message: [
          {
            field: 'email',
            message: 'email not registered',
          },
        ],
      });

    return next.handle().pipe();
  }
}
