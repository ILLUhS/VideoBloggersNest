import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMeta,
  RefreshTokenMetaModelType,
} from '../../../../domain/schemas/refresh-token-meta.schema';

@Injectable()
export class SaRefreshTokenMetaRepository {
  constructor(
    @InjectModel(RefreshTokenMeta.name)
    private refreshTokenMetaModel: RefreshTokenMetaModelType,
  ) {}
  async deleteByUserId(userId: string): Promise<boolean> {
    return (
      await this.refreshTokenMetaModel.deleteMany({ userId: userId }).exec()
    ).acknowledged;
  }
}
