import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class BBlogIdValidator implements ValidatorConstraintInterface {
  constructor(private blogsService: BBlogsRepository) {}

  async validate(blogId: string): Promise<boolean> {
    const blog = await this.blogsService.findById(blogId);
    if (!blog)
      throw new BadRequestException({
        message: [
          {
            field: 'blogId',
            message: 'incorrect blog id',
          },
        ],
      });
    return true;
  }
  defaultMessage() {
    return `blogId incorrect`;
  }
}
