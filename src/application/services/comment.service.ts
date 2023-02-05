import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../../domain/schemas/comment.schema';
import { Injectable } from '@nestjs/common';
import { CommentCreateDtoType } from '../types/comment.create.dto.type';
import { CommentRepository } from '../../infrastructure/repositories/comment.repository';
import { CommentUpdateDto } from '../types/comment.update.dto';

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
  async updateComment(id: string, commentUpdateDto: CommentUpdateDto) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) return false;
    await comment.setContent(commentUpdateDto.content);
    return await this.commentRepository.save(comment);
  }
  async findComment(id: string): Promise<string | null> {
    const comment = await this.commentRepository.findById(id);
    return comment ? comment.userId : null;
  }
  async deleteAllComments() {
    return await this.commentRepository.deleteAll();
  }
  async deleteCommentByTd(id: string) {
    return await this.commentRepository.deleteByTd(id);
  }
}
