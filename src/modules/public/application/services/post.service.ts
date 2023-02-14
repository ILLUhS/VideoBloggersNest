import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../infrastructure/repositories/post.repository';
import { BlogRepository } from '../../infrastructure/repositories/blog.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../../../domain/schemas/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    protected postRepository: PostRepository,
    protected blogRepository: BlogRepository,
  ) /*protected commentService: CommentService*/ {}

  async findPostById(id: string): Promise<string | null> {
    const post = await this.postRepository.findById(id);
    return post ? post.id : null;
  }
  async deletePostByTd(id: string) {
    return await this.postRepository.deleteById(id);
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
  async deleteAllPosts() {
    return await this.postRepository.deleteAll();
  }
}
