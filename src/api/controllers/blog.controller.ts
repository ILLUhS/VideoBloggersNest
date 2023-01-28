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
} from '@nestjs/common';
import { QueryParamsType } from '../types/query.params';
import { queryParamsValidation } from '../helpers';
import { QueryRepository } from '../../infrastructure/query.repository';
import { BlogCreateDtoType } from '../../application/types/blog.create.dto';
import { BlogService } from '../../application/services/blog.service';
import { BlogUpdateDtoType } from '../../application/types/blog.update.dto';
import { Response } from 'express';
import { PostCreateDtoType } from '../../application/types/post.create.dto';
import { PostService } from '../../application/services/post.service';

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
  ) {
    const searchParams = await queryParamsValidation(query);
    return await this.queryRepository.getPotsWithQueryParam(searchParams, {
      blogId: id,
    });
  }
  @Post()
  async createBlog(@Body() blogDto: BlogCreateDtoType, @Res() res: Response) {
    const blogId = await this.blogService.createBlog(blogDto);
    if (!blogId) return res.sendStatus(400);
    return res
      .status(201)
      .json(await this.queryRepository.findBlogById(blogId));
  }
  @Post(':id/posts')
  async createPostByBlogId(
    @Param('id') id: string,
    @Body() postDto: PostCreateDtoType,
    @Res() res: Response,
  ) {
    postDto.blogId = id;
    const postId = await this.postService.createPost(postDto);
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
