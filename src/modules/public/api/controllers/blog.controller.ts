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
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { QueryRepository } from '../../infrastructure/query.repository';
import { BlogCreateDto } from '../../application/types/blog.create.dto';
import { BlogService } from '../../application/services/blog.service';
import { BlogUpdateDto } from '../../application/types/blog.update.dto';
import { Request } from 'express';
import { PostCreateDto } from '../../application/types/post.create.dto';
import { PostService } from '../../application/services/post.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { BlogPostInputDto } from '../types/blog.post.input.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../../../super-admin/api/pipes/query-transform.pipe';

@SkipThrottle()
@Controller('blogs')
export class BlogController {
  constructor(
    protected queryRepository: QueryRepository,
    protected blogService: BlogService,
    protected postService: PostService,
  ) {}

  @Get()
  async findAll(@Query(new QueryTransformPipe()) query: QueryParamsDto) {
    return await this.queryRepository.getBlogsWithQueryParam(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const blog = await this.queryRepository.findBlogById(id);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id/posts')
  async findPostsByBlogId(
    @Param('id') id: string,
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: Request,
  ) {
    const blog = await this.queryRepository.findBlogById(id);
    if (!blog) throw new NotFoundException();
    if (req.user)
      return await this.queryRepository.getPotsWithQueryParam(
        query,
        { blogId: id },
        req.user['userId'],
      );
    return await this.queryRepository.getPotsWithQueryParam(query, {
      blogId: id,
    });
  }
}
