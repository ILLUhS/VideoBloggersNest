import { Injectable } from '@nestjs/common';
import { BBlogsRepository } from '../../infrastructure/repositories/b-blogs.repository';
import { BlogDocument } from '../../../../domain/schemas/blog.schema';

@Injectable()
export class BBlogsService {
  constructor(private blogsRepository: BBlogsRepository) {}

  async findBlogById(id: string): Promise<BlogDocument | null> {
    return await this.blogsRepository.findById(id);
  }
}
