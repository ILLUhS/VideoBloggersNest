import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUnbanUserCommand } from './commands/ban-unban-user.command';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../../domain/schemas/user.schema';
import { SaUsersRepository } from '../../../infrastructure/repositories/sa-users.repository';
import { SaUsersService } from '../../services/sa-users.service';
import { BadRequestException } from '@nestjs/common';
import { SaRefreshTokenMetaRepository } from '../../../infrastructure/repositories/sa-refresh-token-meta.repository';
import { SkipThrottle } from '@nestjs/throttler';
import { SaPostsRepository } from '../../../infrastructure/repositories/sa-posts.repository';
import { SaCommentsRepository } from '../../../infrastructure/repositories/sa-comments.repository';
import { SaReactionsRepository } from '../../../infrastructure/repositories/sa-reactions.repository';

@SkipThrottle()
@CommandHandler(BanUnbanUserCommand)
export class BanUnbanUserUseCase
  implements ICommandHandler<BanUnbanUserCommand>
{
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private usersService: SaUsersService,
    private usersRepository: SaUsersRepository,
    private postsRepository: SaPostsRepository,
    private commentsRepository: SaCommentsRepository,
    private reactionsRepository: SaReactionsRepository,
    private refreshTokenMetaRepository: SaRefreshTokenMetaRepository,
  ) {}
  async execute(command: BanUnbanUserCommand) {
    const { id, isBanned, banReason } = command.banUserDto;
    const user = await this.usersService.findUserById(id);
    if (!user)
      throw new BadRequestException({
        message: [{ field: 'id', message: 'invalid id' }],
      });
    //ищем все посты, комменты и лайки пользоателя
    const postsByUser = await this.postsRepository.findByUserId(id);
    const commentByUsers = await this.commentsRepository.findByUserId(id);
    const reactionsByUser = await this.reactionsRepository.findByUserId(id);
    //выставляем всем сущностям бан статус
    if (isBanned) {
      await user.ban(banReason);
      //delete all sessions by user
      await this.refreshTokenMetaRepository.deleteByUserId(id);
    } else await user.unban();
    await this.usersRepository.save(user);

    if (postsByUser) {
      postsByUser.forEach((p) => {
        p.setBanStatus(isBanned);
        this.postsRepository.save(p);
      });
    }

    if (commentByUsers) {
      commentByUsers.forEach((c) => {
        c.setBanStatus(isBanned);
        this.commentsRepository.save(c);
      });
    }

    if (reactionsByUser) {
      reactionsByUser.forEach((r) => {
        r.setBanStatus(isBanned);
        this.reactionsRepository.save(r);
      });
    }
    return;
  }
}
