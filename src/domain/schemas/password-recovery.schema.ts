import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PasswordRecoveryCreateDtoType } from '../../modules/public/application/types/password.recovery.create.dto.type';

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;

export type PasswordRecoveryModelMethods = {
  recoveryConfirm(): Promise<boolean>;
  updRecovery(email: string): Promise<void>;
};
export type PasswordRecoveryModelStaticMethods = {
  makeInstance(
    PasswordRecoveryDto: PasswordRecoveryCreateDtoType,
    PasswordRecoveryModel: PasswordRecoveryModelType,
  ): Promise<PasswordRecoveryDocument>;
};
export type PasswordRecoveryModelType = Model<PasswordRecoveryDocument> &
  PasswordRecoveryModelMethods &
  PasswordRecoveryModelStaticMethods;

@Schema()
export class PasswordRecovery {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  recoveryCode: string;

  @Prop({ required: true })
  expirationTime: Date;

  @Prop({ required: true })
  isUsed: boolean;

  @Prop({ required: true })
  createdAt: string;

  async recoveryConfirm(): Promise<boolean> {
    if (this.expirationTime <= new Date() || this.isUsed === true) return false;
    this.isUsed = true;
    return true;
  }
  async updRecovery(email: string): Promise<void> {
    this.email = email;
    this.recoveryCode = uuidv4();
    this.expirationTime = add(new Date(), { hours: 24 });
    this.isUsed = false;
  }

  static async makeInstance(
    PasswordRecoveryDto: PasswordRecoveryCreateDtoType,
    PasswordRecoveryModel: PasswordRecoveryModelType,
  ): Promise<PasswordRecoveryDocument> {
    return new PasswordRecoveryModel({
      userId: PasswordRecoveryDto.userId,
      email: PasswordRecoveryDto.email,
      recoveryCode: uuidv4(),
      expirationTime: add(new Date(), { hours: 24 }),
      isUsed: false,
      createdAt: new Date().toISOString(),
    });
  }
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
PasswordRecoverySchema.statics = {
  makeInstance: PasswordRecovery.makeInstance,
};
PasswordRecoverySchema.methods = {
  recoveryConfirm: PasswordRecovery.prototype.recoveryConfirm,
  updRecovery: PasswordRecovery.prototype.updRecovery,
};
