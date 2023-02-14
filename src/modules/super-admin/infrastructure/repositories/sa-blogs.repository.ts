import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  BlogModelType,
} from '../../../../domain/schemas/blog.schema';

@Injectable()
export class SaBlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async findById(id: string): Promise<BlogDocument | null> {
    return this.blogModel.findOne({ id: id });
  }
  async save(blog: BlogDocument): Promise<boolean> {
    return !!(await blog.save());
  }
}
