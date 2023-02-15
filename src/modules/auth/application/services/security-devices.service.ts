import { Injectable } from '@nestjs/common';
import { RefreshTokenMetasRepository } from '../../ifrastructure/repositories/refresh.token.metas.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(
    private refreshTokenMetasRepository: RefreshTokenMetasRepository,
  ) {}

  async deleteSession(userId: string, deviceId: string) {
    return await this.refreshTokenMetasRepository.deleteByUserIdAndDeviceId(
      userId,
      deviceId,
    );
  }
}
