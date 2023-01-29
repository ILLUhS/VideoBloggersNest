import { Injectable } from '@nestjs/common';
import {
  Blog,
  BlogDocument,
  BlogModelType,
} from '../../domain/schemas/blog.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogRepository {
  //объект с методами управления данными
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async findById(id: string): Promise<BlogDocument | null> {
    return this.blogModel.findOne({ id: id });
  }
  async deleteById(id: string): Promise<boolean> {
    return (
      (await this.blogModel.deleteOne({ id: id }).exec()).deletedCount === 1
    );
  }
  async deleteAll(): Promise<boolean> {
    return (await this.blogModel.deleteMany().exec()).acknowledged;
  }
  async save(blog: BlogDocument): Promise<boolean> {
    return !!(await blog.save());
  }
}
