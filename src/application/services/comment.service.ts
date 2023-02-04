import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../../domain/schemas/comment.schema';
import { Injectable } from '@nestjs/common';
import { CommentCreateDtoType } from '../types/comment.create.dto.type';
import { CommentRepository } from '../../infrastructure/repositories/comment.repository';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    private commentRepository: CommentRepository,
  ) {}

  async createComment(
    commentDto: CommentCreateDtoType,
  ): Promise<string | null> {
    const comment = await this.commentModel.makeInstance(
      commentDto,
      this.commentModel,
    );
    const result = await this.commentRepository.save(comment);
    return result ? comment.id : null;
  }
}
