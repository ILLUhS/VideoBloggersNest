import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogCommand } from './commands/update-blog.command';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';
import { BPostsRepository } from '../../../infrastructure/repositories/b-posts.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private blogsRepository: BBlogsRepository,
    private postsRepository: BPostsRepository,
  ) {}

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { id, blogDto } = command;
    const blog = await this.blogsRepository.findById(id);
    if (!blog) throw new NotFoundException();
    blog.updateProperties(blogDto);
    const posts = await this.postsRepository.findPostsByBlogId(id);
    if (posts) {
      posts.forEach((p) => {
        p.updateBlogName(blogDto.name);
        this.postsRepository.save(p);
      });
    }
    return await this.blogsRepository.save(blog);
  }
}
