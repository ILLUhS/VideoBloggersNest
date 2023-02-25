import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserForBlogCommand } from './commands/ban-user-for-blog.command';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';
import { BUsersRepository } from '../../../infrastructure/repositories/b-users.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(BanUserForBlogCommand)
export class BanUserFoBlogUseCase
  implements ICommandHandler<BanUserForBlogCommand>
{
  constructor(
    private blogsRepository: BBlogsRepository,
    private usersRepository: BUsersRepository,
  ) {}

  async execute(command: BanUserForBlogCommand): Promise<void> {
    const { userId, bloggerId, banDto } = command;
    const blogsByUser = await this.blogsRepository.findByUserId(bloggerId);
    if (!blogsByUser.length) throw new ForbiddenException();
    const found = blogsByUser.find((b) => b.id === banDto.blogId);
    if (!found) throw new ForbiddenException();
    const blog = await this.blogsRepository.findById(banDto.blogId);
    const bannedUser = await this.usersRepository.findById(userId);
    if (!bannedUser) throw new NotFoundException();
    if (banDto.isBanned)
      blog.banUser({
        id: userId,
        login: bannedUser.login,
        banReason: banDto.banReason,
      });
    else
      blog.unbanUser({
        id: userId,
        login: bannedUser.login,
        banReason: banDto.banReason,
      });
    blog.markModified('bannedUsers'); //монгус не видит изменения во вложенном массиве
    await this.blogsRepository.save(blog);
  }
}
