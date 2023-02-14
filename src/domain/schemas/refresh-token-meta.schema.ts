import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RefreshTokenMetaCreateDto } from '../../modules/auth/types/refresh.token.meta.create.dto';
import { RefreshTokenMetaUpdateDto } from '../../modules/auth/types/refresh.token.meta.update.dto';

export type RefreshTokenMetaDocument = HydratedDocument<RefreshTokenMeta>;

export type RefreshTokenMetaModelMethods = {
  updateProperties(refreshTokenMetaUpdateDto: RefreshTokenMetaUpdateDto): void;
};
export type RefreshTokenMetaModelStaticMethods = {
  makeInstance(
    refreshTokenMetaModelDto: RefreshTokenMetaCreateDto,
    RefreshTokenMetaModel: RefreshTokenMetaModelType,
  ): RefreshTokenMetaDocument;
};
export type RefreshTokenMetaModelType = Model<RefreshTokenMetaDocument> &
  RefreshTokenMetaModelMethods &
  RefreshTokenMetaModelStaticMethods;

@Schema()
export class RefreshTokenMeta {
  @Prop({ required: true })
  issuedAt: number;

  @Prop({ required: true })
  expirationAt: number;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  deviceIp: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  userId: string;

  static makeInstance(
    refreshTokenMetaCreateDto: RefreshTokenMetaCreateDto,
    RefreshTokenMetaModel: RefreshTokenMetaModelType,
  ): RefreshTokenMetaDocument {
    return new RefreshTokenMetaModel(refreshTokenMetaCreateDto);
  }

  updateProperties(refreshTokenMetaUpdateDto: RefreshTokenMetaUpdateDto) {
    this.issuedAt = refreshTokenMetaUpdateDto.issuedAt;
    this.expirationAt = refreshTokenMetaUpdateDto.expirationAt;
    this.deviceIp = refreshTokenMetaUpdateDto.deviceIp;
  }
}

export const RefreshTokenMetaSchema =
  SchemaFactory.createForClass(RefreshTokenMeta);
RefreshTokenMetaSchema.statics = {
  makeInstance: RefreshTokenMeta.makeInstance,
};
RefreshTokenMetaSchema.methods = {
  updateProperties: RefreshTokenMeta.prototype.updateProperties,
};
