import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewPairTokensCommand } from './commands/create-new-pair-tokens.command';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../services/auth.service';
import { RefreshTokenMetasRepository } from '../../../ifrastructure/repositories/refresh.token.metas.repository';
import { TokensType } from '../../types/tokens.type';

@CommandHandler(CreateNewPairTokensCommand)
export class CreateNewPairTokensUseCase
  implements ICommandHandler<CreateNewPairTokensCommand>
{
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private refreshTokenMetaRepository: RefreshTokenMetasRepository,
  ) {}

  async execute(command: CreateNewPairTokensCommand): Promise<TokensType> {
    const { userId, login, deviceId, ip } = command;
    const accessToken = await this.authService.createAccessToken(userId, login);
    const refreshToken = await this.authService.createRefreshToken(
      userId,
      login,
      deviceId,
    );
    const getPayload = await this.authService.getPayload(refreshToken);
    const token = await this.refreshTokenMetaRepository.findByUserIdAndDeviceId(
      userId,
      deviceId,
    );
    token.updateProperties({
      issuedAt: getPayload.iat,
      expirationAt: getPayload.exp,
      deviceIp: ip,
    });
    await this.refreshTokenMetaRepository.save(token);
    return { accessToken, refreshToken };
  }
}
