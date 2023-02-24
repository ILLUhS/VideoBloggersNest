import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from './commands/create-comment.command';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';
import { BlogRepository } from '../../../infrastructure/repositories/blog.repository';

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private postRepository: PostsRepository,
    private blogRepository: BlogRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string | null> {
    const { commentDto } = command;
    const post = await this.postRepository.findById(commentDto.postId);
    if (!post) throw new NotFoundException();
    const blog = await this.blogRepository.findById(post.blogId);
    const userIsBanned = blog.bannedUsers.find(
      (u) => u.userId === commentDto.userId && u.isBanned,
    );
    if (userIsBanned) throw new UnauthorizedException();
    const comment = await this.commentsRepository.create(commentDto);
    const result = await this.commentsRepository.save(comment);
    return result ? comment.id : null;
  }
}
