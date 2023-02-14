import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../../domain/schemas/blog.schema';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { BlogsQueryRepository } from '../../../public/infrastructure/query.repositories/blogs-query.repository';

@Injectable()
export class BBlogsQueryRepository extends BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) protected blogModel: BlogModelType) {
    super(blogModel);
  }

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
}
