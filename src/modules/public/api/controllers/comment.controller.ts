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
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { CommentUpdateDto } from '../../application/types/comment.update.dto';
import { CheckOwnerCommentInterceptor } from './interceptors/check.owner.comment.interceptor';
import { LikeStatusInputDto } from '../types/like.status.input.dto';
import { LikeService } from '../../application/services/like.service';
import { SkipThrottle } from '@nestjs/throttler';
import { CommentsQueryRepository } from '../../infrastructure/query.repositories/comments-query.repository';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../../application/use-cases/commenst/commands/update-comment.command';
import { DeleteCommentCommand } from '../../application/use-cases/commenst/commands/delete-comment.command';
import { CreateLikeDislikeCommand } from '../../application/use-cases/reactions/commands/create-like-dislike.command';

@SkipThrottle()
@Controller('comments')
export class CommentController {
  constructor(
    private commandBus: CommandBus,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commentService: CommentsQueryRepository,
    protected likeService: LikeService,
  ) {}

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id')
  async findCommentById(@Param('id') id: string, @Req() req: RequestWithUser) {
    const comment = await this.commentsQueryRepository.findCommentById(
      id,
      req.user.userId,
    );
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerCommentInterceptor)
  @HttpCode(204)
  @Put(':id')
  async updComment(
    @Param('id') id: string,
    @Body() commentDto: CommentUpdateDto,
  ) {
    const result = await this.commandBus.execute<
      UpdateCommentCommand,
      Promise<boolean>
    >(new UpdateCommentCommand(id, commentDto));
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async setLikeDislike(
    @Param('id') id: string,
    @Body() likeStatusInputDto: LikeStatusInputDto,
    @Req() req: RequestWithUser,
  ) {
    const result = await this.commandBus.execute(
      new CreateLikeDislikeCommand({
        userId: req.user.userId,
        login: req.user.login,
        reaction: likeStatusInputDto.likeStatus,
        entityId: id,
      }),
    );
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerCommentInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    const result = this.commandBus.execute<
      DeleteCommentCommand,
      Promise<boolean>
    >(new DeleteCommentCommand(id));
    if (!result) throw new NotFoundException();
    return;
  }
}
