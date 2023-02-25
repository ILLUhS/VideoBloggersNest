import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../../domain/schemas/blog.schema';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { BlogsViewType } from '../../api/types/blog.view.type';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) protected blogModel: BlogModelType) {}

  async getBlogsWithQueryParam(searchParams: QueryParamsDto) {
    const blogs = await this.blogModel
      .find({
        name: { $regex: searchParams.searchNameTerm, $options: 'i' },
      })
      .where({ isBanned: false })
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
        isMembership: 1,
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
      })),
    };
  }
  async findBlogById(id: string): Promise<BlogsViewType | null> {
    return await this.blogModel
      .findOne({ id: id })
      .where({ isBanned: false })
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
