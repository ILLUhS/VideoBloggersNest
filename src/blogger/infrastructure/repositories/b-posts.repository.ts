import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelType,
} from '../../../domain/schemas/post.schema';

@Injectable()
export class BPostsRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}
  async deleteById(id: string): Promise<boolean> {
    return (
      (await this.postModel.deleteOne({ id: id }).exec()).deletedCount === 1
    );
  }
  async deleteAll(): Promise<boolean> {
    return (await this.postModel.deleteMany().exec()).acknowledged;
  }
  async findById(id: string): Promise<PostDocument | null> {
    return this.postModel.findOne({ id: id });
  }
  async save(post: PostDocument): Promise<boolean> {
    return !!(await post.save());
  }
  async findPostsByBlogId(blogId: string): Promise<PostDocument[] | null> {
    return this.postModel.find({ blogId: blogId });
  }
}
