import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../../../auth/api/controllers/query-transform.pipe';
import { QueryParamsDto } from '../../../api/types/query-params.dto';
import RequestWithUser from '../../../api/interfaces/request-with-user.interface';
import { BBlogsQueryRepository } from '../../infrastructure/query.repositories/b-blogs-query.repository';
import { BlogCreateDto } from '../../../application/types/blog.create.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../../application/use-cases/blogs/commands/create-blog.command';

@SkipThrottle()
@Controller('blogger/blogs')
export class BlogsPostsController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BBlogsQueryRepository,
  ) {}

  @UseGuards(BearerAuthGuard)
  @Get()
  async findBlogsByUser(
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.blogsQueryRepository.getBlogsByUserId(
      query,
      req.user.userId,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Post()
  async createBlog(
    @Body() blogDto: BlogCreateDto,
    @Req() req: RequestWithUser,
  ) {
    const blogId = await this.commandBus.execute<
      CreateBlogCommand,
      Promise<string | null>
    >(
      new CreateBlogCommand(blogDto, {
        userId: req.user.userId,
        login: req.user.login,
      }),
    );
    if (!blogId) throw new InternalServerErrorException();
    return await this.blogsQueryRepository.findBlogById(blogId);
  }
}
