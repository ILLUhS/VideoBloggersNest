import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDislikeCommand } from './commands/create-like-dislike.command';
import { ReactionsRepository } from '../../../infrastructure/repositories/reaction.repository';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateLikeDislikeCommand)
export class CreateLikeDislikeUseCase
  implements ICommandHandler<CreateLikeDislikeCommand>
{
  constructor(
    private reactionsRepository: ReactionsRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateLikeDislikeCommand): Promise<boolean> {
    const { entityId, reaction, userId, login } = command.reactionDto;
    const commentUserId = await this.commentsRepository.findById(entityId);
    if (!commentUserId) throw new NotFoundException();
    const alreadyLike = await this.reactionsRepository.find(entityId, userId);
    if (alreadyLike) {
      alreadyLike.setStatus(reaction);
      return await this.reactionsRepository.save(alreadyLike);
    }
    const newLike = await this.reactionsRepository.create({
      entityId,
      userId,
      login,
      reaction,
    });
    return await this.reactionsRepository.save(newLike);
  }
}
