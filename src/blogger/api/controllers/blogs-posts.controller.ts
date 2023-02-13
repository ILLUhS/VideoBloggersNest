import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../../../auth/api/controllers/query-transform.pipe';
import { QueryParamsDto } from '../../../api/types/query-params.dto';
import RequestWithUser from '../../../api/interfaces/request-with-user.interface';

@SkipThrottle()
@Controller('blogger/blogs')
export class BlogsPostsController {
  constructor() {}

  @UseGuards(BearerAuthGuard)
  @Get()
  async findBlogsByUser(
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: RequestWithUser,
  ) {
    return;
  }
}
