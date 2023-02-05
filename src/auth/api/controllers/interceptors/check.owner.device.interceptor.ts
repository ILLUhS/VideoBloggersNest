import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../../application/services/auth.service';

@Injectable()
export class CheckOwnerDeviceInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (req.originalUrl.split('/')[1] === 'security') {
      const userId = await this.authService.findSession(req.params.id);
      if (!userId) throw new NotFoundException();
      if (req.user['userId'] !== userId) throw new ForbiddenException();
    }
    return next.handle().pipe();
  }
}
