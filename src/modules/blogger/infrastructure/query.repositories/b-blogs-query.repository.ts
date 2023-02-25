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
  async getBanUsersByBlogId(searchParams: QueryParamsDto, blogId: string) {
    //ищем блог
    const blog = await this.blogModel.findOne({ id: blogId }).exec();
    //берём массив забаниных пользователей
    let bannedUsers = blog.bannedUsers.filter(
      (b) =>
        b.isBanned === true &&
        b.login.match(new RegExp(searchParams.searchLoginTerm, 'i')),
    );
    const usersCount = bannedUsers.length;
    //первый элемент на странице
    const firstIndex = (searchParams.pageNumber - 1) * searchParams.pageSize;
    //последний элемент на странице
    const lastIndex = firstIndex + searchParams.pageSize - 1;
    //берём нужную часть массива
    bannedUsers = bannedUsers.slice(firstIndex, lastIndex);
    bannedUsers.sort((a, b) => {
      const elemA = a[searchParams.sortBy];
      const elemB = b[searchParams.sortBy];
      let result;
      if (elemA < elemB) result = -1;
      else if (elemA > elemB) result = 1;
      else result = 0;
      if (searchParams.sortDirection === 'desc') result = -result;
      return result;
    });

    return {
      pagesCount: Math.ceil(usersCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: usersCount,
      items: bannedUsers.map((u) => ({
        id: u.id,
        login: u.login,
        banInfo: {
          isBanned: u.isBanned,
          banDate: u.banDate,
          banReason: u.banReason,
        },
      })),
    };
  }
}
