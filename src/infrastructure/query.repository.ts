import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/schemas/blog.schema';
import { Post, PostModelType } from '../domain/schemas/post.schema';
import { QueryParamsType } from '../api/controllers/types/query.params';
import { BlogsViewType } from '../api/controllers/types/blog.view';
import { FilterQueryType } from '../api/controllers/types/filter.query';
import { ReactionDocument } from '../domain/schemas/reaction.schema';

@Injectable()
export class QueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    @InjectModel(Post.name) private postModel: PostModelType,
  ) {}
  async getBlogsWithQueryParam(searchParams: QueryParamsType) {
    const blogs = await this.blogModel
      .find({
        name: { $regex: searchParams.searchNameTerm, $options: 'i' },
      })
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({
        _id: 0,
        id: 1,
        name: 1,
        description: 1,
        websiteUrl: 1,
        createdAt: 1,
      })
      .exec();
    const blogsCount = await this.blogModel
      .countDocuments()
      .where('name')
      .regex(new RegExp(searchParams.searchNameTerm, 'i'))
      .exec();
    return {
      pagesCount: Math.ceil(blogsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: blogsCount,
      items: blogs.map((blog) => ({
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
      })),
    };
  }
  async findBlogById(id: string): Promise<BlogsViewType | null> {
    return await this.blogModel
      .findOne({ id: id })
      .select({
        _id: 0,
        id: 1,
        name: 1,
        description: 1,
        websiteUrl: 1,
        createdAt: 1,
      })
      .exec();
  }
  async getPotsWithQueryParam(
    searchParams: QueryParamsType,
    filter?: FilterQueryType,
    userId?: string,
  ) {
    if (!filter) filter = {};
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
  async findPostById(id: string, userId?: string) {
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
  /*async getUsersWithQueryParam(searchParams: QueryParamsType) {
    const users = await this.db.UserModel.find()
      .or([
        {
          'accountData.login': {
            $regex: searchParams.searchLoginTerm,
            $options: 'i',
          },
        },
        {
          'accountData.email': {
            $regex: searchParams.searchEmailTerm,
            $options: 'i',
          },
        },
      ])
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({
        _id: 0,
        id: 1,
        'accountData.login': 1,
        'accountData.email': 1,
        'accountData.createdAt': 1,
      })
      .exec();
    const usersCount = await this.db.UserModel.countDocuments()
      .or([
        {
          'accountData.login': {
            $regex: searchParams.searchLoginTerm,
            $options: 'i',
          },
        },
        {
          'accountData.email': {
            $regex: searchParams.searchEmailTerm,
            $options: 'i',
          },
        },
      ])
      .exec();
    return {
      pagesCount: Math.ceil(usersCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: usersCount,
      items: users.map((user) => ({
        id: user.id,
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
      })),
    };
  }
  async findUserById(id: string): Promise<UserViewType | null> {
    const user = await this.db.UserModel.findOne({ id: id })
      .select({
        _id: 0,
        id: 1,
        'accountData.login': 1,
        'accountData.email': 1,
        'accountData.createdAt': 1,
      })
      .exec();
    return user
      ? {
          id: user.id,
          login: user.accountData.login,
          email: user.accountData.email,
          createdAt: user.accountData.createdAt,
        }
      : null;
  }
  async findCommentById(
    id: string,
    userId?: string,
  ): Promise<CommentsViewType | null> {
    const comment = await this.db.CommentModel.findOne({ id: id })
      .populate('reactions')
      .select({ _id: 0, __v: 0 })
      .exec();
    if (!comment) return null;
    const likesInfoMapped = await this.likesInfoMap(comment.reactions, userId);
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
      likesInfo: likesInfoMapped,
    };
  }
  async getCommentsWithQueryParam(
    searchParams: QueryParamsType,
    filter?: FilterQueryType,
    userId?: string,
  ) {
    if (!filter) filter = {};
    const comments = await this.db.CommentModel.find(filter)
      .populate('reactions')
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({ _id: 0, __v: 0 })
      .exec();
    const commentsCount = await this.db.CommentModel.countDocuments(
      filter,
    ).exec();
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
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: likesInfoMapped,
          };
        }),
      ),
    };
  }*/
  async likesInfoMap(reactions: ReactionDocument[], userId?: string) {
    if (!userId) userId = '';
    let myStatus = 'None';
    let likesCount = 0;
    let dislikesCount = 0;
    if (reactions.length > 0) {
      reactions.forEach((r) => {
        if (r.userId === userId) myStatus = r.reaction;
        if (r.reaction === 'Like') likesCount++;
        else dislikesCount++;
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
