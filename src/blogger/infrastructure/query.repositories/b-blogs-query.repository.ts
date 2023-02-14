import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../domain/schemas/blog.schema';
import { QueryParamsDto } from '../../../api/types/query-params.dto';
import { BlogsViewType } from '../../../api/types/blog.view.type';

@Injectable()
export class BBlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async getBlogsByUserId(searchParams: QueryParamsDto, userId: string) {
    const blogs = await this.blogModel
      .find({
        userId: userId,
        name: { $regex: searchParams.searchNameTerm, $options: 'i' },
      })
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({ _id: 0, __v: 0 })
      .exec();
    const blogsCount = await this.blogModel
      .countDocuments({ userId: userId })
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
        isMembership: 1,
      })
      .exec();
  }
}
