import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRepository } from '../../infrastructure/query.repository';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { CommentUpdateDto } from '../../application/types/comment.update.dto';
import { CommentService } from '../../application/services/comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CheckOwnerInterceptor } from './interceptors/check.owner.interceptor';

@Controller('comments')
export class CommentController {
  constructor(
    protected queryRepository: QueryRepository,
    protected commentService: CommentService,
  ) {}

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const comment = await this.queryRepository.findCommentById(id);
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CheckOwnerInterceptor)
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
  @UseInterceptors(CheckOwnerInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    const result = this.commentService.deleteCommentByTd(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
