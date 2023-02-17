import { Injectable } from '@nestjs/common';
import { SaBlogsRepository } from '../../infrastructure/repositories/sa-blogs.repository';
import { BlogDocument } from '../../../../domain/schemas/blog.schema';

@Injectable()
export class SaBlogsService {
  constructor(private blogsRepository: SaBlogsRepository) {}

  async findBlogById(id: string): Promise<BlogDocument | null> {
    return await this.blogsRepository.findById(id);
  }
}
