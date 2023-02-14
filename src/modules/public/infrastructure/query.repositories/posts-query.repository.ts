import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../../../domain/schemas/post.schema';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { FilterQueryType } from '../../api/types/filter.query.type';
import { QueryMapHelpers } from './query-map.helpers';

@Injectable()
export class PostsQueryRepository extends QueryMapHelpers {
  constructor(@InjectModel(Post.name) protected postModel: PostModelType) {
    super();
  }

  async getPotsWithQueryParam(
    searchParams: QueryParamsDto,
    filter: FilterQueryType = {}, //установка дефолтного значения
    userId = '',
  ) {
    const posts = await this.postModel
      .find(filter)
      .populate('reactions')
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({ _id: 0, __v: 0 })
      .exec();
    const postsCount = await this.postModel.countDocuments(filter).exec();
    return {
      pagesCount: Math.ceil(postsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: postsCount,
      items: await Promise.all(
        posts.map(async (post) => {
          const likesInfoMapped = await this.likesInfoMap(
            post.reactions,
            userId,
          );
          const newestLikesMapped = await this.newestLikesMap([
            ...post.reactions,
          ]);
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
        }),
      ),
    };
  }
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
}
