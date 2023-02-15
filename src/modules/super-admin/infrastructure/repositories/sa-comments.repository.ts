import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../../../../domain/schemas/comment.schema';
import { CommentsRepository } from '../../../public/infrastructure/repositories/comments.repository';

@Injectable()
export class SaCommentsRepository extends CommentsRepository {
  constructor(
    @InjectModel(Comment.name) protected commentModel: CommentModelType,
  ) {
    super(commentModel);
  }

  async findByUserId(userId: string): Promise<CommentDocument[] | null> {
    return this.commentModel.find({ userId: userId });
  }
}
