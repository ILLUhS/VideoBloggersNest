import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentModelType,
} from '../../../../domain/schemas/comment.schema';
import { Blog, BlogModelType } from '../../../../domain/schemas/blog.schema';
import { Post, PostModelType } from '../../../../domain/schemas/post.schema';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';

@Injectable()
export class BCommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) protected commentModel: CommentModelType,
    @InjectModel(Blog.name) protected blogModel: BlogModelType,
    @InjectModel(Post.name) protected postModel: PostModelType,
  ) {}

  async getCommentsByBlog(searchParams: QueryParamsDto, userId: string) {
    //берём все блоги юзера
    const blogs = await this.blogModel
      .find({ userId: userId })
      .where({ isBanned: false })
      .exec();
    const blogsId = blogs.map((b) => b.id);
    //ищем все посты юзера
    const posts = await this.postModel
      .find({ blogId: blogsId })
      .where({ isBanned: false })
      .exec();
    const postsId = posts.map((p) => p.id);
    //ищем все комментарии ко всем постам юзера
    const comments = await this.commentModel
      .find({ postId: postsId })
      .where({ isBanned: false })
      .populate({ path: 'post', match: { isBanned: false } })
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .exec();
    const commentsCount = await this.commentModel
      .countDocuments({ postId: postsId })
      .where({ isBanned: false })
      .exec();

    return {
      pagesCount: Math.ceil(commentsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: commentsCount,
      items: comments.map((c) => ({
        id: c.id,
        content: c.content,
        commentatorInfo: {
          userId: c.userId,
          userLogin: c.userLogin,
        },
        createdAt: c.createdAt,
        postInfo: {
          id: c.post.id,
          title: c.post.title,
          blogId: c.post.blogId,
          blogName: c.post.blogName,
        },
      })),
    };
  }
}
