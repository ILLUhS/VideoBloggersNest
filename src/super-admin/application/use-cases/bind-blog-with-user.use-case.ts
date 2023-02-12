import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BindBlogWithUserCommand } from './commands/bind-blog-with-user.command';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { BlogRepository } from '../../../infrastructure/repositories/blog.repository';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserUseCase
  implements ICommandHandler<BindBlogWithUserCommand>
{
  constructor(
    private usersRepository: UserRepository,
    private blogsRepository: BlogRepository,
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
