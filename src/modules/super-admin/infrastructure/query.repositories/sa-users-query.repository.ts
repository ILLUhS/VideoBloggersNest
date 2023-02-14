import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../domain/schemas/user.schema';
import { QueryParamsDto } from '../../api/dto/query-params.dto';
import { UserViewType } from '../../../public/api/types/user.view.type';

@Injectable()
export class SaUsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async getUsersWithBanInfo(searchParams: QueryParamsDto) {
    let banSearch;
    switch (searchParams.banStatus) {
      case 'all':
        banSearch = {};
        break;
      case 'banned':
        banSearch = { isBanned: true };
        break;
      case 'notBanned':
        banSearch = { isBanned: false };
        break;
      default:
        banSearch = {};
    }
    const users = await this.userModel
      .find(banSearch)
      .or([
        {
          login: {
            $regex: searchParams.searchLoginTerm,
            $options: 'i',
          },
        },
        {
          email: {
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
        login: 1,
        email: 1,
        createdAt: 1,
        isBanned: 1,
        banDate: 1,
        banReason: 1,
      })
      .exec();
    const usersCount = await this.userModel
      .countDocuments(banSearch)
      .or([
        {
          login: {
            $regex: searchParams.searchLoginTerm,
            $options: 'i',
          },
        },
        {
          email: {
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
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        banInfo: {
          isBanned: user.isBanned,
          banDate: user.banDate,
          banReason: user.banReason,
        },
      })),
    };
  }

  async findUserById(id: string): Promise<UserViewType | null> {
    const user = await this.userModel
      .findOne({ id: id })
      .select({
        _id: 0,
        id: 1,
        login: 1,
        email: 1,
        createdAt: 1,
        isBanned: 1,
        banDate: 1,
        banReason: 1,
      })
      .exec();
    return user
      ? {
          id: user.id,
          login: user.login,
          email: user.email,
          createdAt: user.createdAt,
          banInfo: {
            isBanned: user.isBanned,
            banDate: user.banDate,
            banReason: user.banReason,
          },
        }
      : null;
  }
}
