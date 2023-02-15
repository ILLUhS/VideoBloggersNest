import { Injectable } from '@nestjs/common';
import { ReactionDocument } from '../../../domain/schemas/reaction.schema';

@Injectable()
export class QueryMapHelpers {
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
