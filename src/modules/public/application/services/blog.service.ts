import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../../domain/schemas/blog.schema';
import { BlogUpdateDto } from '../types/blog.update.dto';
import { BlogRepository } from '../../infrastructure/repositories/blog.repository';
import { PostRepository } from '../../infrastructure/repositories/post.repository';

@Injectable()
export class BlogService {
  //объект с методами управления данными
  constructor(
    @InjectModel(Blog.name)
    private blogModel: BlogModelType,
    protected blogRepository: BlogRepository,
    protected postRepository: PostRepository,
  ) {}

  async findBlogById(id: string): Promise<string | null> {
    const blog = await this.blogRepository.findById(id);
    return blog ? blog.id : null;
  }

  async updateBlog(id: string, blogDto: BlogUpdateDto) {
    const blog = await this.blogRepository.findById(id);
    if (!blog) return false;
    blog.updateProperties(blogDto);
    const posts = await this.postRepository.findPostsByBlogId(id);
    if (posts) {
      posts.forEach((p) => {
        p.updateBlogName(blogDto.name);
        this.postRepository.save(p);
      });
    }
    return await this.blogRepository.save(blog);
  }

  async deleteBlogByTd(id: string) {
    return await this.blogRepository.deleteById(id);
  }

  async deleteAllBlogs() {
    return await this.blogRepository.deleteAll();
  }
}
