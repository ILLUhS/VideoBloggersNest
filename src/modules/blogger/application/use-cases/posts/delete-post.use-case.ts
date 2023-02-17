import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from './commands/delete-post.command';
import { BPostsRepository } from '../../../infrastructure/repositories/b-posts.repository';
import { BBlogsService } from '../../services/b-blogs.service';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private blogsService: BBlogsService,
    private postsRepository: BPostsRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
    const { postId, blogId } = command.BlogIdPostIdDto;
    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return await this.postsRepository.deleteById(postId);
  }
}
