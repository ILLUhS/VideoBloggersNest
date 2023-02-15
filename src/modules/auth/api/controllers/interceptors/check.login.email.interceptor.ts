import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../application/services/auth.service';

@Injectable()
export class CheckLoginEmailInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    let loginInvalid = false;
    let emailInvalid = false;

    let user = await this.authService.findUserByField('login', req.body.login);
    if (user) loginInvalid = true;

    user = await this.authService.findUserByField('email', req.body.email);
    if (user) emailInvalid = true;

    if (loginInvalid && emailInvalid)
      throw new BadRequestException({
        message: [
          {
            field: 'login',
            message: 'login already used',
          },
          {
            field: 'email',
            message: 'email already used',
          },
        ],
      });
    else if (loginInvalid)
      throw new BadRequestException({
        message: [
          {
            field: 'login',
            message: 'login already used',
          },
        ],
      });
    else if (emailInvalid)
      throw new BadRequestException({
        message: [
          {
            field: 'email',
            message: 'email already used',
          },
        ],
      });

    return next.handle().pipe();
  }
}
