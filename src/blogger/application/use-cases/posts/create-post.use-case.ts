import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './commands/create-post.command';
import { BPostsRepository } from '../../../infrastructure/repositories/b-posts.repository';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../../../domain/schemas/post.schema';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    private blogsRepository: BBlogsRepository,
    private postsRepository: BPostsRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<string | null> {
    const { postDto } = command;
    const currentBlog = await this.blogsRepository.findById(postDto.blogId);
    if (!currentBlog) throw new NotFoundException();
    const newPost = this.postModel.makeInstance(
      postDto,
      this.postModel,
      currentBlog.name,
    );
    const result = await this.postsRepository.save(newPost);
    return result ? newPost.id : null;
  }
}
