import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BPostsService } from '../../../application/services/b-posts.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class PostIdValidator implements ValidatorConstraintInterface {
  constructor(private postsService: BPostsService) {}

  async validate(postId: string): Promise<boolean> {
    const post = await this.postsService.findPostById(postId);
    if (!post) throw new NotFoundException();
    return true;
  }
  defaultMessage() {
    return `blogId incorrect`;
  }
}
