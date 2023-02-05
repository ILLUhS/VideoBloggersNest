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
import { QueryParamsType } from '../types/query.params.type';
import { queryParamsValidation } from '../helpers';
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

@SkipThrottle()
@Controller('blogs')
export class BlogController {
  constructor(
    protected queryRepository: QueryRepository,
    protected blogService: BlogService,
    protected postService: PostService,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParamsType) {
    const searchParams = await queryParamsValidation(query);
    return await this.queryRepository.getBlogsWithQueryParam(searchParams);
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
    @Query() query: QueryParamsType,
    @Req() req: Request,
  ) {
    const searchParams = await queryParamsValidation(query);
    const blog = await this.queryRepository.findBlogById(id);
    if (!blog) throw new NotFoundException();
    if (req.user)
      return await this.queryRepository.getPotsWithQueryParam(
        searchParams,
        { blogId: id },
        req.user['userId'],
      );
    return await this.queryRepository.getPotsWithQueryParam(searchParams, {
      blogId: id,
    });
  }

  @UseGuards(AuthGuard('basic'))
  @Post()
  async createBlog(@Body() blogDto: BlogCreateDto) {
    const blogId = await this.blogService.createBlog(blogDto);
    if (!blogId) throw new InternalServerErrorException();
    return await this.queryRepository.findBlogById(blogId);
  }

  @UseGuards(AuthGuard('basic'))
  @Post(':id/posts')
  async createPostByBlogId(
    @Param('id') id: string,
    @Body() postDto: BlogPostInputDto,
  ) {
    const postCreateDto: PostCreateDto = {
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: id,
    };
    const blog = await this.queryRepository.findBlogById(id);
    if (!blog) throw new NotFoundException();
    const postId = await this.postService.createPost(postCreateDto);
    if (!postId) throw new InternalServerErrorException();
    return await this.queryRepository.findPostById(postId);
  }

  @UseGuards(AuthGuard('basic'))
  @HttpCode(204)
  @Put(':id')
  async updateBlogById(
    @Param('id') id: string,
    @Body() blogDto: BlogUpdateDto,
  ) {
    const result = await this.blogService.updateBlog(id, blogDto);
    if (!result) throw new NotFoundException();
    return;
  }

  @UseGuards(AuthGuard('basic'))
  @HttpCode(204)
  @Delete(':id')
  async deleteBlogById(@Param('id') id: string) {
    const result = await this.blogService.deleteBlogByTd(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
