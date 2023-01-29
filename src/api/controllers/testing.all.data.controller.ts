import { Controller, Delete, Res } from '@nestjs/common';
import { BlogService } from '../../application/services/blog.service';
import { PostService } from '../../application/services/post.service';
import { UserService } from '../../application/services/user.service';
import { Response } from 'express';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    protected blogService: BlogService,
    protected postService: PostService,
    protected userService: UserService,
  ) {}
  @Delete()
  async DeleteAll(@Res() res: Response) {
    await this.blogService.deleteAllBlogs();
    await this.postService.deleteAllPosts();
    await this.userService.deleteAllUsers();
    return res.sendStatus(204);
  }
}
