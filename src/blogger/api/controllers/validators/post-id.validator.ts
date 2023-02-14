import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BPostsService } from '../../../application/services/b-posts.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class PostIdValidator implements ValidatorConstraintInterface {
  constructor(private postsService: BPostsService) {}

  async validate(postId: string): Promise<boolean> {
    const post = await this.postsService.findPostById(postId);
    return !!post;
  }
  defaultMessage() {
    return `blogId incorrect`;
  }
}
