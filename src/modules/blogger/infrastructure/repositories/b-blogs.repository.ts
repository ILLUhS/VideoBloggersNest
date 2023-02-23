import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  BlogModelType,
} from '../../../../domain/schemas/blog.schema';

@Injectable()
export class BBlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async findById(id: string): Promise<BlogDocument | null> {
    return this.blogModel.findOne({ id: id });
  }
  async findByUserId(userId: string): Promise<BlogDocument | null> {
    return this.blogModel.findOne({ userId: userId });
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
