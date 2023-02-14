import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument, Model } from 'mongoose';
import { PostCreateDto } from '../../modules/public/application/types/post.create.dto';
import { PostUpdateDto } from '../../modules/public/application/types/post.update.dto';
import { Reaction, ReactionDocument } from './reaction.schema';

export type PostDocument = HydratedDocument<Post>;

export type PostModelMethods = {
  updateProperties(postDto: PostUpdateDto, blogName: string): void;
  updateBlogName(blogName: string): void;
};
export type PostModelStaticMethods = {
  makeInstance(
    postDto: PostCreateDto,
    PostModel: PostModelType,
    blogName: string,
  ): PostDocument;
};
export type PostModelType = Model<PostDocument> &
  PostModelMethods &
  PostModelStaticMethods;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
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

  reactions: ReactionDocument[];

  static makeInstance(
    postDto: PostCreateDto,
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

  updateProperties(postDto: PostUpdateDto, blogName: string) {
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
PostSchema.virtual('reactions', {
  ref: Reaction.name,
  localField: 'id',
  foreignField: 'entityId',
  options: { lean: true },
});
