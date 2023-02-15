import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../../application/services/auth.service';
import { Observable } from 'rxjs';
import RequestWithUser from '../../../../../api/interfaces/request-with-user.interface';

@Injectable()
export class CheckBanUserInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    const user = await this.authService.findUserByField('id', req.user.userId);
    if (user && user.isBanned) throw new UnauthorizedException();
    return next.handle().pipe();
  }
}
