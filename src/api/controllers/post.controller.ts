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
import { QueryRepository } from '../../infrastructure/query.repository';
import { PostService } from '../../application/services/post.service';
import { QueryParamsType } from '../types/query.params.type';
import { queryParamsValidation } from '../helpers';
import { Request } from 'express';
import { PostCreateDto } from '../../application/types/post.create.dto';
import { PostUpdateDtoType } from '../../application/types/post.update.dto.type';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { CommentInputDto } from '../types/comment.input.dto';
import { CommentService } from '../../application/services/comment.service';
import { CommentCreateDtoType } from '../../application/types/comment.create.dto.type';

@Controller('posts')
export class PostController {
  constructor(
    protected queryRepository: QueryRepository,
    protected postService: PostService,
    protected commentService: CommentService,
  ) {}

  @UseInterceptors(AuthHeaderInterceptor)
  @Get()
  async findAll(@Query() query: QueryParamsType, @Req() req: Request) {
    const searchParams = await queryParamsValidation(query);
    if (req.user)
      return await this.queryRepository.getPotsWithQueryParam(
        searchParams,
        {},
        req.user['userId'],
      );
    return await this.queryRepository.getPotsWithQueryParam(searchParams);
  }

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const post = await this.queryRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id/comments')
  async findCommentsByPostId(
    @Param('id') id: string,
    @Query() query: QueryParamsType,
  ) {
    const searchParams = await queryParamsValidation(query);
    const post = await this.queryRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    return await this.queryRepository.getCommentsWithQueryParam(searchParams, {
      postId: id,
    });
  }

  @UseGuards(AuthGuard('basic'))
  @Post()
  async createPost(@Body() postDto: PostCreateDto) {
    const postId = await this.postService.createPost(postDto);
    if (!postId) throw new NotFoundException();
    return await this.queryRepository.findPostById(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  async createCommentByPostId(
    @Param('id') postId: string,
    @Body() commentDto: CommentInputDto,
    @Req() req: Request,
  ) {
    const post = await this.queryRepository.findPostById(postId);
    if (!post) throw new NotFoundException();
    const commentCreateDto: CommentCreateDtoType = {
      content: commentDto.content,
      userId: req.user['userId'],
      userLogin: req.user['login'],
      postId: postId,
    };
    const commentId = await this.commentService.createComment(commentCreateDto);
    if (!commentId) throw new InternalServerErrorException();
    return await this.queryRepository.findCommentById(commentId);
  }

  @UseGuards(AuthGuard('basic'))
  @HttpCode(204)
  @Put(':id')
  async updatePostById(
    @Param('id') id: string,
    @Body() postDto: PostUpdateDtoType,
  ) {
    const result = await this.postService.updatePost(id, postDto);
    if (!result) throw new NotFoundException();
    return;
  }

  @UseGuards(AuthGuard('basic'))
  @HttpCode(204)
  @Delete(':id')
  async deleteBlogById(@Param('id') id: string) {
    const result = await this.postService.deletePostByTd(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
