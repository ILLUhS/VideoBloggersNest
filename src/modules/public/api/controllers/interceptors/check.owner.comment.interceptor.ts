import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommentsService } from '../../../application/services/comments.service';

@Injectable()
export class CheckOwnerCommentInterceptor implements NestInterceptor {
  constructor(private commentService: CommentsService) {}
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
    return next.handle().pipe();
  }
}
