import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentCommand } from './commands/update-comment.command';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand): Promise<boolean> {
    const { id } = command;
    const { content } = command.commentDto;
    const comment = await this.commentsRepository.findById(id);
    if (!comment) throw new NotFoundException();
    await comment.setContent(content);
    return await this.commentsRepository.save(comment);
  }
}
