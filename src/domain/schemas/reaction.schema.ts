import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type ReactionDocument = HydratedDocument<Reaction>;

export class Reaction {
  @Prop({ required: true })
  id: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  entityId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  reaction: string;

  @Prop({ enum: ['Like', 'Dislike'], required: true })
  createdAt: Date;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
