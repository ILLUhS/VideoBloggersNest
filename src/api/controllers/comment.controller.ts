import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRepository } from '../../infrastructure/query.repository';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';

@Controller('comments')
export class CommentController {
  constructor(protected queryRepository: QueryRepository) {}

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const comment = await this.queryRepository.findCommentById(id);
    if (!comment) throw new NotFoundException();
    return comment;
  }
}
