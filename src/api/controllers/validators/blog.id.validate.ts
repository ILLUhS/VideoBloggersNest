import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogService } from '../../../application/services/blog.service';

@ValidatorConstraint({ name: 'blogId', async: true })
@Injectable()
export class BlogIdValidate implements ValidatorConstraintInterface {
  constructor(private blogService: BlogService) {}

  async validate(blogId: string): Promise<boolean> {
    const foundBlogId = await this.blogService.findBlogById(blogId);
    return !!foundBlogId;
  }
  defaultMessage() {
    return `blogId incorrect`;
  }
}
