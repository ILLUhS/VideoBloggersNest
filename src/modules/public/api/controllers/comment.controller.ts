import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryMapHelpers } from '../../infrastructure/query.repositories/query-map.helpers';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { CommentUpdateDto } from '../../application/types/comment.update.dto';
import { CommentService } from '../../application/services/comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CheckOwnerCommentInterceptor } from './interceptors/check.owner.comment.interceptor';
import { LikeStatusInputDto } from '../types/like.status.input.dto';
import { LikeService } from '../../application/services/like.service';
import { Request } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('comments')
export class CommentController {
  constructor(
    protected queryRepository: QueryMapHelpers,
    protected commentService: CommentService,
    protected likeService: LikeService,
  ) {}

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id')
  async findCommentById(@Param('id') id: string, @Req() req: Request) {
    let comment;
    if (req.user)
      comment = await this.queryRepository.findCommentById(
        id,
        req.user['userId'],
      );
    else comment = await this.queryRepository.findCommentById(id);
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CheckOwnerCommentInterceptor)
  @HttpCode(204)
  @Put(':id')
  async updComment(
    @Param('id') id: string,
    @Body() commentUpdateDto: CommentUpdateDto,
  ) {
    const result = this.commentService.updateComment(id, commentUpdateDto);
    if (!result) throw new NotFoundException();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @Put(':id/like-status')
  async setLikeDislike(
    @Param('id') id: string,
    @Body() likeStatusInputDto: LikeStatusInputDto,
    @Req() req: Request,
  ) {
    const commentUserId = await this.commentService.findComment(id);
    if (!commentUserId) throw new NotFoundException();
    const result = await this.likeService.createLikeDislike({
      userId: req.user['userId'],
      login: req.user['login'],
      reaction: likeStatusInputDto.likeStatus,
      entityId: id,
    });
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CheckOwnerCommentInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    const result = this.commentService.deleteCommentByTd(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
