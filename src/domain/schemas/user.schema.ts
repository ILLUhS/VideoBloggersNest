import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UserCreateDtoType } from '../../application/types/user.create.dto.type';

export type UserDocument = HydratedDocument<User>;

export type UserModelMethods = {
  emailConfirm(): Promise<boolean>;
  emailExpDate(): Promise<void>;
  setPassHash(newPassHash: string): Promise<void>;
};
export type UserModelStaticMethods = {
  makeInstance(
    userDto: UserCreateDtoType,
    UserModel: UserModelType,
  ): Promise<UserDocument>;
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
  emailExpirationTime: Date;

  @Prop({ required: true })
  emailIsConfirmed: boolean;

  async emailConfirm(): Promise<boolean> {
    if (
      this.emailExpirationTime <= new Date() ||
      this.emailIsConfirmed === true
    )
      return false;
    this.emailIsConfirmed = true;
    return true;
  }
  async updEmailExpDate(): Promise<void> {
    this.emailExpirationTime = add(new Date(), { hours: 24 });
  }
  async setPassHash(newPassHash: string): Promise<void> {
    this.passwordHash = newPassHash;
  }

  static async makeInstance(
    userDto: UserCreateDtoType,
    UserModel: UserModelType,
  ): Promise<UserDocument> {
    return new UserModel({
      id: uuidv4(),
      login: userDto.login,
      passwordHash: userDto.passwordHash,
      email: userDto.email,
      createdAt: new Date().toISOString(),
      emailConfirmationCode: uuidv4(),
      emailExpirationTime: add(new Date(), { hours: 24 }),
      emailIsConfirmed: false,
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.statics = {
  makeInstance: User.makeInstance,
};
UserSchema.methods = {
  emailConfirm: User.prototype.emailConfirm,
  emailExpDate: User.prototype.updEmailExpDate,
  setPassHash: User.prototype.setPassHash,
};
