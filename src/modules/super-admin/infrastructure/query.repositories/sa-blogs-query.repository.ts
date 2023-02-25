import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../api/dto/query-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../../domain/schemas/blog.schema';

@Injectable()
export class SaBlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async getBlogsWithOwnerInfo(searchParams: QueryParamsDto) {
    const blogs = await this.blogModel
      .find({
        name: { $regex: searchParams.searchNameTerm, $options: 'i' },
      })
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({
        _id: 0,
        __v: 0,
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
        isMembership: blog.isMembership,
        blogOwnerInfo: {
          userId: blog.userId,
          userLogin: blog.userLogin,
        },
        banInfo: {
          isBanned: blog.isBanned,
          banDate: blog.banDate,
        },
      })),
    };
  }
}
