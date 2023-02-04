import { Controller, Delete, Res } from '@nestjs/common';
import { BlogService } from '../../application/services/blog.service';
import { PostService } from '../../application/services/post.service';
import { UserService } from '../../application/services/user.service';
import { Response } from 'express';
import { AuthService } from '../auth/services/auth.service';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    protected blogService: BlogService,
    protected postService: PostService,
    protected userService: UserService,
    protected authService: AuthService,
  ) {}
  @Delete()
  async DeleteAll(@Res() res: Response) {
    await this.blogService.deleteAllBlogs();
    await this.postService.deleteAllPosts();
    await this.userService.deleteAllUsers();
    await this.authService.deleteAllRefreshTokMeta();
    await this.authService.deleteAllPassRec();
    return res.sendStatus(204);
  }
}
