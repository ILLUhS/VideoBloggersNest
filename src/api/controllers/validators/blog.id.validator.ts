import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogService } from '../../../application/services/blog.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(private blogService: BlogService) {}

  async validate(blogId: string): Promise<boolean> {
    const foundBlogId = await this.blogService.findBlogById(blogId);
    return !!foundBlogId;
  }
  defaultMessage() {
    return `blogId incorrect`;
  }
}