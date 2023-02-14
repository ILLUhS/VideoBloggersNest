import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../../domain/schemas/post.schema';

@Injectable()
export class BPostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}

  async findNewPostById(id: string) {
    const post = await this.postModel
      .findOne({ id: id })
      .select({ _id: 0, __v: 0 })
      .exec();
    if (!post) return null;
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
}
