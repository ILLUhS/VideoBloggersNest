import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelType,
} from '../../../../domain/schemas/post.schema';
import { PostsRepository } from '../../../public/infrastructure/repositories/posts.repository';

@Injectable()
export class SaPostsRepository extends PostsRepository {
  constructor(@InjectModel(Post.name) protected postModel: PostModelType) {
    super(postModel);
  }

  async findByUserId(userId: string): Promise<PostDocument[] | null> {
    return this.postModel.find({ userId: userId });
  }
}
