import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BBlogsService } from '../../../application/services/b-blogs.service';
import RequestWithUser from '../../../../../api/interfaces/request-with-user.interface';

@Injectable()
export class CheckOwnerBlogInterceptor implements NestInterceptor {
  constructor(private blogsService: BBlogsService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    if (req.originalUrl.split('/')[2] === 'blogs') {
      let id: string;
      if (req.params.id) id = req.params.id;
      else if (req.params.blogId) id = req.params.blogId;
      const blog = await this.blogsService.findBlogById(id);
      if (!blog) throw new NotFoundException();
      if (req.user.userId !== blog.userId) throw new ForbiddenException();
    }
    return next.handle().pipe();
  }
}
