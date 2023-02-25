import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BlogCreateDto } from '../../modules/public/application/types/blog.create.dto';
import { BlogUpdateDto } from '../../modules/public/application/types/blog.update.dto';
import { UserInfoType } from '../../modules/blogger/types/user-info.type';
import { BannedUsersType } from '../types/banned-users.type';
import { BannedUserDtoType } from '../types/banned-user-dto.type';

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelMethods = {
  updateProperties(blogDto: BlogUpdateDto): void;
  setOwner(userId: string, userLogin: string): void;
  banUser(bannedUser: BannedUserDtoType): void;
  unbanUser(bannedUser: BannedUserDtoType): void;
  ban(): void;
  unban(): void;
};
export type BlogModelStaticMethods = {
  makeInstance(
    blogDto: BlogCreateDto,
    userInfo: UserInfoType,
    BlogModel: BlogModelType,
  ): BlogDocument;
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

  @Prop({ required: true })
  isBanned: boolean;

  @Prop({ default: null })
  banDate: string;

  @Prop({ required: true, default: [] })
  bannedUsers: BannedUsersType[];

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
      isBanned: false,
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

  banUser(bannedUser: BannedUserDtoType) {
    this.bannedUsers.push({
      id: bannedUser.id,
      login: bannedUser.login,
      isBanned: true,
      banDate: new Date().toISOString(),
      banReason: bannedUser.banReason,
    });
  }

  unbanUser(bannedUser: BannedUserDtoType) {
    const userIndex = this.bannedUsers.findIndex((e) => e.id === bannedUser.id);
    if (userIndex !== -1) {
      this.bannedUsers[userIndex].isBanned = false;
      this.bannedUsers[userIndex].banReason = null;
      this.bannedUsers[userIndex].banDate = null;
    }
  }

  ban() {
    this.isBanned = true;
    this.banDate = new Date().toISOString();
  }

  unban() {
    this.isBanned = false;
    this.banDate = null;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.statics = { makeInstance: Blog.makeInstance };
BlogSchema.methods = {
  updateProperties: Blog.prototype.updateProperties,
  setOwner: Blog.prototype.setOwner,
  banUser: Blog.prototype.banUser,
  unbanUser: Blog.prototype.unbanUser,
  ban: Blog.prototype.ban,
  unban: Blog.prototype.unban,
};
