import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../../../super-admin/api/pipes/query-transform.pipe';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { BBlogsQueryRepository } from '../../infrastructure/query.repositories/b-blogs-query.repository';
import { BlogCreateDto } from '../../../public/application/types/blog.create.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../../application/use-cases/blogs/commands/create-blog.command';
import { BlogUpdateDto } from '../../../public/application/types/blog.update.dto';
import { UpdateBlogCommand } from '../../application/use-cases/blogs/commands/update-blog.command';
import { CheckOwnerBlogInterceptor } from './interceptors/check-owner-blog.interceptor';
import { DeleteBlogCommand } from '../../application/use-cases/blogs/commands/delete-blog.command';
import { BlogPostInputDto } from '../../../public/api/types/blog.post.input.dto';
import { PostCreateDto } from '../../../public/application/types/post.create.dto';
import { CreatePostCommand } from '../../application/use-cases/posts/commands/create-post.command';
import { BPostsQueryRepository } from '../../infrastructure/query.repositories/b-posts-query.repository';
import { BlogIdPostIdInputDto } from '../input.dto/blog-id-post-id-input-dto';
import { UpdatePostCommand } from '../../application/use-cases/posts/commands/update-post.command';
import { PostUpdateDto } from '../../../public/application/types/post.update.dto';
import { DeletePostCommand } from '../../application/use-cases/posts/commands/delete-post.command';

@SkipThrottle()
@Controller('blogger/blogs')
export class BlogsPostsController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BBlogsQueryRepository,
    private postsQueryRepository: BPostsQueryRepository,
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

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') id: string,
    @Body() postDto: BlogPostInputDto,
  ) {
    const postCreateDto: PostCreateDto = {
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: id,
    };
    const postId = await this.commandBus.execute<
      CreatePostCommand,
      Promise<string | null>
    >(new CreatePostCommand(postCreateDto));
    if (!postId) throw new InternalServerErrorException();
    return await this.postsQueryRepository.findPostById(postId);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @HttpCode(204)
  @Put(':id')
  async updateBlogById(
    @Param('id') id: string,
    @Body() blogDto: BlogUpdateDto,
  ) {
    const result = await this.commandBus.execute<
      UpdateBlogCommand,
      Promise<boolean>
    >(new UpdateBlogCommand(id, blogDto));
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePostByBlogId(
    @Param() BlogIdPostIdDto: BlogIdPostIdInputDto,
    @Body() postDto: PostUpdateDto,
  ) {
    const result = await this.commandBus.execute<
      UpdatePostCommand,
      Promise<boolean>
    >(new UpdatePostCommand(BlogIdPostIdDto, postDto));
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlogById(@Param('id') id: string) {
    const result = await this.commandBus.execute<
      DeleteBlogCommand,
      Promise<boolean>
    >(new DeleteBlogCommand(id));
    if (!result) throw new NotFoundException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePostByBlogId(@Param() BlogIdPostIdDto: BlogIdPostIdInputDto) {
    const result = await this.commandBus.execute<
      DeletePostCommand,
      Promise<boolean>
    >(new DeletePostCommand(BlogIdPostIdDto));
    if (!result) throw new NotFoundException();
    return;
  }
}
