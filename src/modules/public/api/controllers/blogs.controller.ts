import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../pipes/query-transform.pipe';
import { BlogsQueryRepository } from '../../infrastructure/query.repositories/blogs-query.repository';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { PostsQueryRepository } from '../../infrastructure/query.repositories/posts-query.repository';

@SkipThrottle()
@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async findAll(@Query(new QueryTransformPipe()) query: QueryParamsDto) {
    return await this.blogsQueryRepository.getBlogsWithQueryParam(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.findBlogById(id);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id/posts')
  async findPostsByBlogId(
    @Param('id') id: string,
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: RequestWithUser,
  ) {
    const blog = await this.blogsQueryRepository.findBlogById(id);
    if (!blog) throw new NotFoundException();
    return await this.postsQueryRepository.getPotsWithQueryParam(
      query,
      {
        blogId: id,
      },
      req.user.userId,
    );
  }
}
