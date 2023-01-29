import * as bcrypt from 'bcrypt';
import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UserCreateDtoType } from '../../application/types/user.create.dto.type';

export type UserDocument = HydratedDocument<User>;

//export type UserModelMethods = {};
export type UserModelStaticMethods = {
  makeInstanceByAdmin(
    userDto: UserCreateDtoType,
    UserModel: UserModelType,
  ): Promise<UserDocument>;
};
export type UserModelType = Model<UserDocument> & UserModelStaticMethods;

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

  static async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  static async makeInstanceByAdmin(
    userDto: UserCreateDtoType,
    UserModel: UserModelType,
  ): Promise<UserDocument> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await User.generateHash(
      userDto.password,
      passwordSalt,
    );
    return new UserModel({
      id: uuidv4(),
      login: userDto.login,
      passwordHash: passwordHash,
      email: userDto.email,
      createdAt: new Date().toISOString(),
      emailConfirmationCode: uuidv4(),
      emailExpirationTime: add(new Date(), { hours: 24 }),
      emailIsConfirmed: true,
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.statics = { makeInstanceByAdmin: User.makeInstanceByAdmin };
//UserSchema.methods = {};
