import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReactionDocument } from './reaction.schema';
import { v4 as uuidv4 } from 'uuid';
import { CommentUpdateDtoType } from '../../application/types/comment.update.dto.type';
import { CommentCreateDtoType } from '../../application/types/comment.create.dto.type';

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelMethods = {
  updateProperties(commentDto: CommentUpdateDtoType): void;
};
export type CommentModelStaticMethods = {
  makeInstance(
    commentDto: CommentCreateDtoType,
    CommentModel: CommentModelType,
  ): CommentDocument;
};
export type CommentModelType = Model<CommentDocument> &
  CommentModelMethods &
  CommentModelStaticMethods;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Comment {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  postId: string;

  reactions: ReactionDocument[];

  static makeInstance(
    commentDto: CommentCreateDtoType,
    CommentModel: CommentModelType,
  ): CommentDocument {
    return new CommentModel({
      id: uuidv4(),
      content: commentDto.content,
      userId: commentDto.userId,
      userLogin: commentDto.userLogin,
      postId: commentDto.postId,
      createdAt: new Date().toISOString(),
    });
  }

  updateProperties(commentDto: CommentUpdateDtoType) {
    this.content = commentDto.content;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.statics = { makeInstance: Comment.makeInstance };
CommentSchema.methods = {
  updateProperties: Comment.prototype.updateProperties,
};
CommentSchema.virtual('reactions', {
  ref: 'Reaction',
  localField: 'id',
  foreignField: 'entityId',
  options: { lean: true },
});
