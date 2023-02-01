import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QueryParamsType } from '../types/query.params.type';
import { queryParamsValidation } from '../helpers';
import { QueryRepository } from '../../infrastructure/query.repository';
import { BlogCreateDto } from '../../application/types/blog.create.dto';
import { BlogService } from '../../application/services/blog.service';
import { BlogUpdateDtoType } from '../../application/types/blog.update.dto.type';
import { Response } from 'express';
import { PostCreateDto } from '../../application/types/post.create.dto';
import { PostService } from '../../application/services/post.service';
import { AuthGuard } from '@nestjs/passport';

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
  async findById(@Param('id') id: string, @Res() res: Response) {
    const blog = await this.queryRepository.findBlogById(id);
    if (!blog) return res.sendStatus(404);
    return res.status(200).json(blog);
  }
  @Get(':id/posts')
  async findPostsByBlogId(
    @Param('id') id: string,
    @Query() query: QueryParamsType,
    @Res() res: Response,
  ) {
    const searchParams = await queryParamsValidation(query);
    const blog = await this.queryRepository.findBlogById(id);
    if (!blog) return res.sendStatus(404);
    return res.status(200).json(
      await this.queryRepository.getPotsWithQueryParam(searchParams, {
        blogId: id,
      }),
    );
  }
  @UseGuards(AuthGuard('basic'))
  @Post()
  async createBlog(@Body() blogDto: BlogCreateDto, @Res() res: Response) {
    const blogId = await this.blogService.createBlog(blogDto);
    if (!blogId) return res.sendStatus(400);
    return res
      .status(201)
      .json(await this.queryRepository.findBlogById(blogId));
  }
  @Post(':id/posts')
  async createPostByBlogId(
    @Param('id') id: string,
    @Body() postDto: PostCreateDto,
    @Res() res: Response,
  ) {
    const postClass: PostCreateDto = {
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: id,
    };
    const blog = await this.queryRepository.findBlogById(id);
    if (!blog) return res.sendStatus(404);
    postDto.blogId = id;
    const postId = await this.postService.createPost(postClass);
    if (!postId) return res.sendStatus(400);
    return res
      .status(201)
      .json(await this.queryRepository.findPostById(postId));
  }
  @Put(':id')
  async updateBlogById(
    @Param('id') id: string,
    @Body() blogDto: BlogUpdateDtoType,
    @Res() res: Response,
  ) {
    const result = await this.blogService.updateBlog(id, blogDto);
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
  }
  @Delete(':id')
  async deleteBlogById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.blogService.deleteBlogByTd(id);
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
  }
}
