import { Injectable } from '@nestjs/common';
import { SaBlogsRepository } from '../../infrastructure/repositories/sa-blogs.repository';

@Injectable()
export class SaBlogsService {
  constructor(private blogsRepository: SaBlogsRepository) {}

  async findBlogById(id: string): Promise<string | null> {
    const blog = await this.blogsRepository.findById(id);
    return blog ? blog.id : null;
  }
}
