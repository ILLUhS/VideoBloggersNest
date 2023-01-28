import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserCreateDtoType } from '../../application/types/user.create.dto.type';

export type UserDocument = HydratedDocument<User>;

export type UserModelMethods = {};
export type UserModelStaticMethods = {
  makeInstance(
    userDto: UserCreateDtoType,
    UserModel: UserModelType,
  ): UserDocument;
};
export type UserModelType = Model<UserDocument> &
  UserModelMethods &
  UserModelStaticMethods;

@Schema()
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  emailConfirmationCode: string;

  @Prop({ required: true })
  emailExpirationTime: string;

  @Prop({ required: true })
  emailIsConfirmed: boolean;

  static makeInstance(
    userDto: UserCreateDtoType,
    UserModel: UserModelType,
  ): UserDocument {
    return new UserModel({
      id: uuidv4(),
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: postDto.blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    });
  }
}

export const PostSchema = SchemaFactory.createForClass(User);
PostSchema.statics = { makeInstance: User.makeInstance };
PostSchema.methods = {};
