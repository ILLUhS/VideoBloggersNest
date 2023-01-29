import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../infrastructure/repositories/post.repository';
import { PostCreateDtoType } from '../types/post.create.dto.type';
import { BlogRepository } from '../../infrastructure/repositories/blog.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/schemas/post.schema';
import { PostUpdateDtoType } from '../types/post.update.dto.type';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    protected postRepository: PostRepository,
    protected blogRepository: BlogRepository,
  ) /*protected commentService: CommentService*/ {}
  async findPostById(id: string) {
    return await this.postRepository.findById(id);
  }
  async deletePostByTd(id: string) {
    return await this.postRepository.deleteById(id);
  }
  async createPost(postDto: PostCreateDtoType): Promise<string | null> {
    const currentBlog = await this.blogRepository.findById(postDto.blogId);
    if (!currentBlog) return null;
    const newPost = this.postModel.makeInstance(
      postDto,
      this.postModel,
      currentBlog.name,
    );
    const result = await this.postRepository.save(newPost);
    return result ? newPost.id : null;
  }
  /*async createCommentByPostId(
    content: string,
    userId: string,
    userLogin: string,
    postId: string,
  ) {
    return await this.commentService.createComment(
      content,
      userId,
      userLogin,
      postId,
    );
  }*/
  async updatePost(id: string, postDto: PostUpdateDtoType) {
    const foundBlog = await this.blogRepository.findById(postDto.blogId);
    if (!foundBlog) return false;
    const post = await this.postRepository.findById(id);
    if (!post) return false;
    post.updateProperties(postDto, foundBlog.name);
    return await this.postRepository.save(post);
  }
  async deleteAllPosts() {
    return await this.postRepository.deleteAll();
  }
}
