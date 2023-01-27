import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/schemas/blog.schema';
import { BlogCreateDtoType } from '../types/blog.create.dto';
import { BlogUpdateDtoType } from '../types/blog.update.dto';
import { BlogRepository } from '../../infrastructure/repositories/blog.repository';

@Injectable()
export class BlogService {
  //объект с методами управления данными
  constructor(
    @InjectModel(Blog.name)
    private blogModel: BlogModelType,
    protected blogRepository: BlogRepository, //protected postsRepository: PostsRepository,
  ) {}
  async findBlogById(id: string) {
    return await this.blogRepository.findById(id);
  }
  async createBlog(blogDto: BlogCreateDtoType) {
    const newBlog = this.blogModel.makeInstance(blogDto, this.blogModel);
    const result = await this.blogRepository.save(newBlog);
    return result ? newBlog.id : null;
  }
  async updateBlog(id: string, blogDto: BlogUpdateDtoType) {
    const blog = await this.blogRepository.findById(id);
    if (!blog) return false;
    blog.updateProperties(blogDto);
    const posts = await this.blogRepository.findPostsByBlogId(id);
    posts!.forEach((p) => {
      p.updateBlogName(blogDto.name);
      this.blogRepository.save(p);
    });
    return await this.blogRepository.save(blog);
  }
  async deleteBlogByTd(id: string) {
    return await this.blogRepository.deleteByTd(id);
  }
  async deleteAllBlogs() {
    return await this.blogRepository.deleteAll();
  }
}
