import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from './commands/create-comment.command';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private postRepository: PostsRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string | null> {
    const { commentDto } = command;
    const post = await this.postRepository.findById(commentDto.postId);
    if (!post) throw new NotFoundException();
    const comment = await this.commentsRepository.create(commentDto);
    const result = await this.commentsRepository.save(comment);
    return result ? comment.id : null;
  }
}
