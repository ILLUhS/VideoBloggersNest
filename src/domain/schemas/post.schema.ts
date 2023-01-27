import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument, Model } from 'mongoose';
import { PostCreateDtoType } from '../../application/types/post.create.dto';
import { PostUpdateDtoType } from '../../application/types/post.update.dto';

export type PostDocument = HydratedDocument<Post>;

export type PostModelMethods = {
  updateProperties(postDto: PostUpdateDtoType, blogName: string): void;
  updateBlogName(blogName: string): void;
};
export type PostModelStaticMethods = {
  makeInstance(
    postDto: PostCreateDtoType,
    PostModel: PostModelType,
    blogName: string,
  ): PostDocument;
};
export type PostModelType = Model<PostDocument> &
  PostModelMethods &
  PostModelStaticMethods;

@Schema()
export class Post {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  static makeInstance(
    postDto: PostCreateDtoType,
    PostModel: PostModelType,
    blogName: string,
  ): PostDocument {
    return new PostModel({
      id: uuidv4(),
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: postDto.blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    });
  }

  updateProperties(postDto: PostUpdateDtoType, blogName: string) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blogId = postDto.blogId;
    this.blogName = blogName;
  }

  updateBlogName(blogName: string) {
    this.blogName = blogName;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.statics = { makeInstance: Post.makeInstance };
PostSchema.methods = {
  updateProperties: Post.prototype.updateProperties,
  updateBlogName: Post.prototype.updateBlogName,
};
