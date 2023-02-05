import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommentService } from '../../../application/services/comment.service';

@Injectable()
export class CheckOwnerInterceptor implements NestInterceptor {
  constructor(private commentService: CommentService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (req.originalUrl.split('/')[1] === 'comments') {
      const commentUserId = await this.commentService.findComment(
        req.params.id,
      );
      if (!commentUserId) throw new NotFoundException();
      if (req.user['userId'] !== commentUserId) throw new ForbiddenException();
    }
    /*if (req.originalUrl.split('/')[1] === 'security') {
      const commentUserId = await this.commentService.findComment(
        req.params.id,
      );
      if (!commentUserId) throw new NotFoundException();
      if (req.user['userId'] !== commentUserId) throw new ForbiddenException();
    }*/
    return next.handle().pipe();
  }
}
