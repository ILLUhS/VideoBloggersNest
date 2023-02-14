import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../../../domain/schemas/post.schema';
import { ReactionDocument } from '../../../../domain/schemas/reaction.schema';

@Injectable()
export class BPostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}

  async findPostById(id: string, userId = '') {
    const post = await this.postModel
      .findOne({ id: id })
      .populate('reactions')
      .select({ _id: 0, __v: 0 })
      .exec();
    if (!post) return null;
    const likesInfoMapped = await this.likesInfoMap(post.reactions, userId);
    const newestLikesMapped = await this.newestLikesMap([...post.reactions]);
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: likesInfoMapped.likesCount,
        dislikesCount: likesInfoMapped.dislikesCount,
        myStatus: likesInfoMapped.myStatus,
        newestLikes: newestLikesMapped,
      },
    };
  }
  async likesInfoMap(reactions: ReactionDocument[], userId: string) {
    let myStatus = 'None';
    let likesCount = 0;
    let dislikesCount = 0;
    if (reactions.length > 0) {
      reactions.forEach((r) => {
        if (r.userId === userId) myStatus = r.reaction;
        if (r.reaction === 'Like') likesCount++;
        else if (r.reaction === 'Dislike') dislikesCount++;
      });
    }
    return {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
    };
  }
  async newestLikesMap(reactions: ReactionDocument[]) {
    //фильтруем копию массива, оставляем только лайки, потом сортируем лайки по дате
    const newestLikes = reactions
      .filter((like) => like.reaction === 'Like')
      .sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        return 0;
      });
    newestLikes.splice(3); //берем первые три лайка
    return newestLikes.map((like) => ({
      addedAt: like.createdAt,
      userId: like.userId,
      login: like.login,
    }));
  }
}
