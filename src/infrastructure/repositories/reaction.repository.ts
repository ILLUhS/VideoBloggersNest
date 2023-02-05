import { Injectable } from '@nestjs/common';
import {
  Reaction,
  ReactionDocument,
  ReactionModelType,
} from '../../domain/schemas/reaction.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReactionsRepository {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: ReactionModelType,
  ) {}
  async save(like: ReactionDocument) {
    return !!(await like.save());
  }
  async find(
    entityId: string,
    userId: string,
  ): Promise<ReactionDocument | null> {
    return this.reactionModel.findOne({
      entityId: entityId,
      userId: userId,
    });
  }
  async delete(entityId: string, userId: string) {
    return (
      (
        await this.reactionModel
          .deleteOne({
            entityId: entityId,
            userId: userId,
          })
          .exec()
      ).deletedCount === 1
    );
  }
  async deleteAll() {
    return (await this.reactionModel.deleteMany().exec()).acknowledged;
  }
}
