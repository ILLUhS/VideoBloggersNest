import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReactionCreateDtoType } from '../../modules/public/application/types/reaction.create.dto.type';
import { v4 as uuidv4 } from 'uuid';

export type ReactionDocument = HydratedDocument<Reaction>;

export type ReactionModelMethods = {
  setStatus(reaction: string): void;
  setBanStatus(isBanned: boolean): void;
};
export type ReactionModelStaticMethods = {
  makeInstance(
    reactionDto: ReactionCreateDtoType,
    ReactionModel: ReactionModelType,
  ): ReactionDocument;
};
export type ReactionModelType = Model<ReactionDocument> &
  ReactionModelMethods &
  ReactionModelStaticMethods;

@Schema()
export class Reaction {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  entityId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ enum: ['None', 'Like', 'Dislike'], required: true })
  reaction: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  isBanned: boolean;

  setStatus(reaction: string): void {
    this.reaction = reaction;
  }

  setBanStatus(isBanned: boolean): void {
    this.isBanned = isBanned;
  }

  static makeInstance(
    reactionDto: ReactionCreateDtoType,
    ReactionModel: ReactionModelType,
  ): ReactionDocument {
    return new ReactionModel({
      id: uuidv4(),
      entityId: reactionDto.entityId,
      userId: reactionDto.userId,
      login: reactionDto.login,
      reaction: reactionDto.reaction,
      createdAt: new Date(),
      isBanned: false,
    });
  }
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
ReactionSchema.statics = { makeInstance: Reaction.makeInstance };
ReactionSchema.methods = {
  setStatus: Reaction.prototype.setStatus,
  setBanStatus: Reaction.prototype.setBanStatus,
};
