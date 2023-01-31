import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BlogCreateDto } from '../../application/types/blog.create.dto';
import { BlogUpdateDtoType } from '../../application/types/blog.update.dto.type';

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelMethods = {
  updateProperties(blogDto: BlogUpdateDtoType): void;
};
export type BlogModelStaticMethods = {
  makeInstance(blogDto: BlogCreateDto, BlogModel: BlogModelType): BlogDocument;
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

  static makeInstance(
    blogDto: BlogCreateDto,
    BlogModel: BlogModelType,
  ): BlogDocument {
    return new BlogModel({
      id: uuidv4(),
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      createdAt: new Date().toISOString(),
    });
  }

  updateProperties(blogDto: BlogUpdateDtoType) {
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.statics = { makeInstance: Blog.makeInstance };
BlogSchema.methods = { updateProperties: Blog.prototype.updateProperties };
