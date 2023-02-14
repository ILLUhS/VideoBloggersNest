import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../../../../domain/schemas/comment.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
  ) {}

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
