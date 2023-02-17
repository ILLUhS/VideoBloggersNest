import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SaBlogsService } from '../../application/services/sa-blogs.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(private blogsService: SaBlogsService) {}

  async validate(blogId: string): Promise<boolean> {
    const foundBlogId = await this.blogsService.findBlogById(blogId);
    if (!foundBlogId) throw new NotFoundException();
    return true;
  }
  defaultMessage() {
    return `blogId incorrect`;
  }
}
