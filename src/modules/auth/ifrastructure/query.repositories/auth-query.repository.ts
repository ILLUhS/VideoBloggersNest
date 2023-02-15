import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../domain/schemas/user.schema';

@Injectable()
export class AuthQueryRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async findAuthUserById(id: string) {
    const user = await this.userModel
      .findOne({ id: id })
      .select({
        _id: 0,
        id: 1,
        login: 1,
        email: 1,
        createdAt: 1,
      })
      .exec();
    return user
      ? {
          email: user.email,
          login: user.login,
          userId: user.id,
        }
      : null;
  }
}
