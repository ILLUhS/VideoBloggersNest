import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMeta,
  RefreshTokenMetaModelType,
} from '../../../../domain/schemas/refresh-token-meta.schema';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(RefreshTokenMeta.name)
    private refreshTokenMetaModel: RefreshTokenMetaModelType,
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
}
