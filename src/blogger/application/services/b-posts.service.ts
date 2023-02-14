import { Injectable } from '@nestjs/common';
import { BPostsRepository } from '../../infrastructure/repositories/b-posts.repository';
import { PostDocument } from '../../../domain/schemas/post.schema';

@Injectable()
export class BPostsService {
  constructor(private postsRepository: BPostsRepository) {}

  async findPostById(id: string): Promise<PostDocument | null> {
    return await this.postsRepository.findById(id);
  }
}
