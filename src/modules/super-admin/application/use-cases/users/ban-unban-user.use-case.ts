import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUnbanUserCommand } from './commands/ban-unban-user.command';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../../domain/schemas/user.schema';
import { SaUsersRepository } from '../../../infrastructure/repositories/sa-users.repository';
import { SaUsersService } from '../../services/sa-users.service';
import { BadRequestException } from '@nestjs/common';
import { SaRefreshTokenMetaRepository } from '../../../infrastructure/repositories/sa-refresh-token-meta.repository';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@CommandHandler(BanUnbanUserCommand)
export class BanUnbanUserUseCase
  implements ICommandHandler<BanUnbanUserCommand>
{
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private usersRepository: SaUsersRepository,
    private usersService: SaUsersService,
    private refreshTokenMetaRepository: SaRefreshTokenMetaRepository,
  ) {}
  async execute(command: BanUnbanUserCommand) {
    const { id, isBanned, banReason } = command.banUserDto;
    const user = await this.usersService.findUserById(id);
    if (!user)
      throw new BadRequestException({
        message: [{ field: 'id', message: 'invalid id' }],
      });
    await user.switchBanStatus(isBanned, banReason);
    await this.usersRepository.save(user);
    await this.refreshTokenMetaRepository.deleteByUserId(id);
    return;
  }
}
