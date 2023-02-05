import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ReactionCreateDtoType } from '../../application/types/reaction.create.dto.type';
import { v4 as uuidv4 } from 'uuid';

export type ReactionDocument = HydratedDocument<Reaction>;

export type ReactionModelMethods = {
  setStatus(reaction: string): void;
};
export type ReactionModelStaticMethods = {
  makeInstance(
    reactionDto: ReactionCreateDtoType,
    reactionModel: ReactionModelType,
  ): ReactionDocument;
};
export type ReactionModelType = Model<ReactionDocument> &
  ReactionModelMethods &
  ReactionModelStaticMethods;

export class Reaction {
  @Prop({ required: true })
  id: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  entityId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ enum: ['None', 'Like', 'Dislike'], required: true })
  reaction: string;

  @Prop({ required: true })
  createdAt: Date;

  setStatus(reaction: string): void {
    this.reaction = reaction;
  }

  static makeInstance(
    reactionDto: ReactionCreateDtoType,
    reactionModel: ReactionModelType,
  ): ReactionDocument {
    return new reactionModel({
      id: uuidv4(),
      entityId: reactionDto.entityId,
      userId: reactionDto.userId,
      login: reactionDto.login,
      reaction: reactionDto.reaction,
      createdAt: new Date(),
    });
  }
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
ReactionSchema.statics = { makeInstance: Reaction.makeInstance };
ReactionSchema.methods = {
  setStatus: Reaction.prototype.setStatus,
};
