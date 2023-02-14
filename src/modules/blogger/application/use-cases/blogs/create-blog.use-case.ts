import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogCommand } from './commands/create-blog.command';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../../../domain/schemas/blog.schema';

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    private blogsRepository: BBlogsRepository,
  ) {}
  async execute(command: CreateBlogCommand): Promise<string | null> {
    const { blogDto, userInfo } = command;
    const newBlog = this.blogModel.makeInstance(
      blogDto,
      userInfo,
      this.blogModel,
    );
    const result = await this.blogsRepository.save(newBlog);
    return result ? newBlog.id : null;
  }
}
