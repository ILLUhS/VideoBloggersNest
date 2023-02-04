import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectConnection()
    private readonly connection: Connection /*protected blogService: BlogService,
    protected postService: PostService,
    protected userService: UserService*/ /*protected authService: AuthService,*/,
  ) {}

  @HttpCode(204)
  @Delete()
  async DeleteAll() {
    const collections = this.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    /*await this.blogService.deleteAllBlogs();
    await this.postService.deleteAllPosts();
    await this.userService.deleteAllUsers();*/
    /*await this.authService.deleteAllRefreshTokMeta();
    await this.authService.deleteAllPassRec();*/
    return;
  }
}
