import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentModelType,
} from '../../../../domain/schemas/comment.schema';
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    private commentRepository: CommentsRepository,
  ) {}

  async findComment(id: string): Promise<string | null> {
    const comment = await this.commentRepository.findById(id);
    return comment ? comment.userId : null;
  }
}
