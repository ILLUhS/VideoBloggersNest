import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BindBlogWithUserCommand } from './commands/bind-blog-with-user.command';
import { SaUsersRepository } from '../../../infrastructure/repositories/sa-users.repository';
import { BadRequestException } from '@nestjs/common';
import { SaBlogsRepository } from '../../../infrastructure/repositories/sa-blogs.repository';

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserUseCase
  implements ICommandHandler<BindBlogWithUserCommand>
{
  constructor(
    private usersRepository: SaUsersRepository,
    private blogsRepository: SaBlogsRepository,
  ) {}
  async execute(command: BindBlogWithUserCommand): Promise<void> {
    const { blogId, userId } = command;
    const user = await this.usersRepository.findById(userId);
    const blog = await this.blogsRepository.findById(blogId);
    if (!user || !blog)
      throw new BadRequestException({
        message: [{ field: 'blogId or userId', message: 'invalid id' }],
      });
    blog.setOwner(user.id, user.login);
    await this.blogsRepository.save(blog);
  }
}
