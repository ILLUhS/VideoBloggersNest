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
import { QueryRepository } from '../../infrastructure/query.repository';
import { PostService } from '../../application/services/post.service';
import { QueryParamsType } from '../types/query.params.type';
import { queryParamsValidation } from '../helpers';
import { Response } from 'express';
import { PostCreateDtoType } from '../../application/types/post.create.dto.type';
import { PostUpdateDtoType } from '../../application/types/post.update.dto.type';

@Controller('posts')
export class PostController {
  constructor(
    protected queryRepository: QueryRepository,
    protected postService: PostService,
  ) {}
  @Get()
  async findAll(@Query() query: QueryParamsType) {
    const searchParams = await queryParamsValidation(query);
    return await this.queryRepository.getPotsWithQueryParam(searchParams);
  }
  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const post = await this.queryRepository.findPostById(id);
    if (!post) return res.sendStatus(404);
    return res.status(200).json(post);
  }
  @Get(':id/comments')
  async findCommentsByPostId(
    @Param('id') id: string,
    @Query() query: QueryParamsType,
    @Res() res: Response,
  ) {
    const searchParams = await queryParamsValidation(query);
    const post = await this.queryRepository.findPostById(id);
    if (!post) return res.sendStatus(404);
    return res.status(200).json(
      await this.queryRepository.getCommentsWithQueryParam(searchParams, {
        postId: id,
      }),
    );
  }
  @Post()
  async createPost(@Body() postDto: PostCreateDtoType, @Res() res: Response) {
    const postId = await this.postService.createPost(postDto);
    if (!postId) return res.sendStatus(400);
    return res
      .status(201)
      .json(await this.queryRepository.findPostById(postId));
  }
  @Put(':id')
  async updatePostById(
    @Param('id') id: string,
    @Body() postDto: PostUpdateDtoType,
    @Res() res: Response,
  ) {
    const result = await this.postService.updatePost(id, postDto);
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
  }
  @Delete(':id')
  async deleteBlogById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.postService.deletePostByTd(id);
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
  }
}
