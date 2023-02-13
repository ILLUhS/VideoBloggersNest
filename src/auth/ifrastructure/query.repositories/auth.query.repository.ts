import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMeta,
  RefreshTokenMetaModelType,
} from '../../../domain/schemas/refresh-token-meta.schema';
import { User, UserModelType } from '../../../domain/schemas/user.schema';

@Injectable()
export class AuthQueryRepository {
  constructor(
    @InjectModel(RefreshTokenMeta.name)
    private refreshTokenMetaModel: RefreshTokenMetaModelType,
    @InjectModel(User.name) private userModel: UserModelType,
  ) {}

  async findSessionsByUserId(userId: string) {
    const sessions = await this.refreshTokenMetaModel
      .find({ userId: userId })
      .exec();
    if (!sessions) return null;
    return sessions.map((s) => ({
      ip: s.deviceIp,
      title: s.deviceName,
      lastActiveDate: new Date(s.issuedAt * 1000).toISOString(),
      deviceId: s.deviceId,
    }));
  }
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
