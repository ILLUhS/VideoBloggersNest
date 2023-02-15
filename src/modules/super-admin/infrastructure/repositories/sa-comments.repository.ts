import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../../../../domain/schemas/comment.schema';
import { CommentRepository } from '../../../public/infrastructure/repositories/comment.repository';

@Injectable()
export class SaCommentsRepository extends CommentRepository {
  constructor(
    @InjectModel(Comment.name) protected commentModel: CommentModelType,
  ) {
    super(commentModel);
  }

  async findByUserId(userId: string): Promise<CommentDocument[] | null> {
    return this.commentModel.find({ userId: userId });
  }
}
