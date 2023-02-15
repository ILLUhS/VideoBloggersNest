import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommentCommand } from './commands/delete-comment.command';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand): Promise<boolean> {
    const { id } = command;
    return await this.commentsRepository.deleteByTd(id);
  }
}
