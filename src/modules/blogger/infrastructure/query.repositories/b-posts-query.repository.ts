import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../../../domain/schemas/post.schema';
import { PostsQueryRepository } from '../../../public/infrastructure/query.repositories/posts-query.repository';

@Injectable()
export class BPostsQueryRepository extends PostsQueryRepository {
  constructor(@InjectModel(Post.name) protected postModel: PostModelType) {
    super(postModel);
  }
}
