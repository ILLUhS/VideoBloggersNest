import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BlogCreateDto } from '../../modules/public/application/types/blog.create.dto';
import { BlogUpdateDto } from '../../modules/public/application/types/blog.update.dto';
import { UserInfoType } from '../../modules/blogger/types/user-info.type';

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelMethods = {
  updateProperties(blogDto: BlogUpdateDto): void;
};
export type BlogModelStaticMethods = {
  makeInstance(
    blogDto: BlogCreateDto,
    userInfo: UserInfoType,
    BlogModel: BlogModelType,
  ): BlogDocument;
  setOwner(userId: string, userLogin: string): void;
};
export type BlogModelType = Model<BlogDocument> &
  BlogModelMethods &
  BlogModelStaticMethods;

@Schema()
export class Blog {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  isMembership: boolean;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;

  static makeInstance(
    blogDto: BlogCreateDto,
    userInfo: UserInfoType,
    BlogModel: BlogModelType,
  ): BlogDocument {
    return new BlogModel({
      id: uuidv4(),
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
      userId: userInfo.userId,
      userLogin: userInfo.login,
    });
  }

  updateProperties(blogDto: BlogUpdateDto) {
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
  }

  setOwner(userId: string, userLogin: string) {
    this.userId = userId;
    this.userLogin = userLogin;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.statics = { makeInstance: Blog.makeInstance };
BlogSchema.methods = {
  updateProperties: Blog.prototype.updateProperties,
  setOwner: Blog.prototype.setOwner,
};
