import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../../../../domain/schemas/comment.schema';
import { Injectable } from '@nestjs/common';
import { CommentCreateDtoType } from '../../application/types/comment.create.dto.type';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) protected commentModel: CommentModelType,
  ) {}

  async create(commentDto: CommentCreateDtoType): Promise<CommentDocument> {
    return this.commentModel.makeInstance(commentDto, this.commentModel);
  }
  async save(comment: CommentDocument) {
    return !!(await comment.save());
  }
  async findById(id: string) {
    return this.commentModel.findOne({ id: id });
  }
  async deleteAll(): Promise<boolean> {
    return (await this.commentModel.deleteMany().exec()).acknowledged;
  }
  async deleteByTd(id: string): Promise<boolean> {
    return (
      (await this.commentModel.deleteOne({ id: id }).exec()).deletedCount === 1
    );
  }
}
