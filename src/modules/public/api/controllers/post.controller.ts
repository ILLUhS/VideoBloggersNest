import {
  Body,
  Controller,
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
import { QueryMapHelpers } from '../../infrastructure/query.repositories/query-map.helpers';
import { PostService } from '../../application/services/post.service';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { Request } from 'express';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { CommentInputDto } from '../types/comment.input.dto';
import { CommentService } from '../../application/services/comment.service';
import { CommentCreateDtoType } from '../../application/types/comment.create.dto.type';
import { LikeStatusInputDto } from '../types/like.status.input.dto';
import { LikeService } from '../../application/services/like.service';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../../../super-admin/api/pipes/query-transform.pipe';

@SkipThrottle()
@Controller('posts')
export class PostController {
  constructor(
    protected queryRepository: QueryMapHelpers,
    protected postService: PostService,
    protected commentService: CommentService,
    protected likeService: LikeService,
  ) {}

  @UseInterceptors(AuthHeaderInterceptor)
  @Get()
  async findAll(
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: Request,
  ) {
    if (req.user)
      return await this.queryRepository.getPotsWithQueryParam(
        query,
        {},
        req.user['userId'],
      );
    return await this.queryRepository.getPotsWithQueryParam(query);
  }

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    let post;
    if (req.user)
      post = await this.queryRepository.findPostById(id, req.user['userId']);
    else post = await this.queryRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id/comments')
  async findCommentsByPostId(
    @Param('id') id: string,
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: Request,
  ) {
    const post = await this.queryRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    if (req.user)
      return await this.queryRepository.getCommentsWithQueryParam(
        query,
        {
          postId: id,
        },
        req.user['userId'],
      );
    return await this.queryRepository.getCommentsWithQueryParam(query, {
      postId: id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  async createCommentByPostId(
    @Param('id') id: string,
    @Body() commentDto: CommentInputDto,
    @Req() req: Request,
  ) {
    const postId = await this.postService.findPostById(id);
    if (!postId) throw new NotFoundException();
    const commentCreateDto: CommentCreateDtoType = {
      content: commentDto.content,
      userId: req.user['userId'],
      userLogin: req.user['login'],
      postId: id,
    };
    const commentId = await this.commentService.createComment(commentCreateDto);
    if (!commentId) throw new InternalServerErrorException();
    return await this.queryRepository.findCommentById(commentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @Put(':id/like-status')
  async setLikeDislike(
    @Param('id') id: string,
    @Body() likeStatusInputDto: LikeStatusInputDto,
    @Req() req: Request,
  ) {
    const postId = await this.postService.findPostById(id);
    if (!postId) throw new NotFoundException();
    const result = await this.likeService.createLikeDislike({
      userId: req.user['userId'],
      login: req.user['login'],
      reaction: likeStatusInputDto.likeStatus,
      entityId: id,
    });
    if (!result) throw new InternalServerErrorException();
    return;
  }
}
