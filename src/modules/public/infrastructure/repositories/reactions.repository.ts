import { Injectable } from '@nestjs/common';
import {
  Reaction,
  ReactionDocument,
  ReactionModelType,
} from '../../../../domain/schemas/reaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ReactionCreateDtoType } from '../../application/types/reaction.create.dto.type';

@Injectable()
export class ReactionsRepository {
  constructor(
    @InjectModel(Reaction.name) protected reactionModel: ReactionModelType,
  ) {}

  async create(reactionDto: ReactionCreateDtoType): Promise<ReactionDocument> {
    return this.reactionModel.makeInstance(reactionDto, this.reactionModel);
  }
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
