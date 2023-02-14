import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBlogCommand } from './commands/delete-blog.command';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BBlogsRepository) {}

  async execute(command: DeleteBlogCommand): Promise<boolean> {
    const { id } = command;
    return await this.blogsRepository.deleteById(id);
  }
}
