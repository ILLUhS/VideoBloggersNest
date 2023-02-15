import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from './commands/update-post.command';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';
import { BPostsRepository } from '../../../infrastructure/repositories/b-posts.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private blogsRepository: BBlogsRepository,
    private postsRepository: BPostsRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<boolean> {
    const { blogIdPostIdDto, postDto } = command;
    const foundBlog = await this.blogsRepository.findById(
      blogIdPostIdDto.blogId,
    );
    if (!foundBlog) throw new NotFoundException();
    const post = await this.postsRepository.findById(blogIdPostIdDto.postId);
    if (!post) throw new NotFoundException();
    post.updateProperties(postDto);
    return await this.postsRepository.save(post);
  }
}
