import { Controller, Get, Param, Res } from '@nestjs/common';
import { QueryRepository } from '../../infrastructure/query.repository';
import { Response } from 'express';

@Controller('comments')
export class CommentController {
  constructor(protected queryRepository: QueryRepository) {}
  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const comment = await this.queryRepository.findCommentById(id);
    if (!comment) return res.sendStatus(404);
    return res.status(200).json(comment);
  }
}
