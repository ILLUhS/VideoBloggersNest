import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentModelType,
} from '../../../../domain/schemas/comment.schema';
import { CommentsViewType } from '../../api/types/comment.view.type';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { FilterQueryType } from '../../api/types/filter.query.type';
import { QueryMapHelpers } from './query-map.helpers';

@Injectable()
export class CommentsQueryRepository extends QueryMapHelpers {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
  ) {
    super();
  }

  async findCommentById(
    id: string,
    userId = '',
  ): Promise<CommentsViewType | null> {
    const comment = await this.commentModel
      .findOne({ id: id })
      .populate('reactions')
      .select({ _id: 0, __v: 0 })
      .exec();
    if (!comment) return null;
    const likesInfoMapped = await this.likesInfoMap(comment.reactions, userId);
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: likesInfoMapped,
    };
  }
  async getCommentsWithQueryParam(
    searchParams: QueryParamsDto,
    filter: FilterQueryType = {},
    userId = '',
  ) {
    if (!filter) filter = {};
    const comments = await this.commentModel
      .find(filter)
      .populate('reactions')
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({ _id: 0, __v: 0 })
      .exec();
    const commentsCount = await this.commentModel.countDocuments(filter).exec();
    return {
      pagesCount: Math.ceil(commentsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: commentsCount,
      items: await Promise.all(
        comments.map(async (comment) => {
          const likesInfoMapped = await this.likesInfoMap(
            comment.reactions,
            userId,
          );
          return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
              userId: comment.userId,
              userLogin: comment.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: likesInfoMapped,
          };
        }),
      ),
    };
  }
}
