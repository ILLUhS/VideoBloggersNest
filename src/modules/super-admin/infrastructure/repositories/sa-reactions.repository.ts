import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Reaction,
  ReactionDocument,
  ReactionModelType,
} from '../../../../domain/schemas/reaction.schema';
import { ReactionsRepository } from '../../../public/infrastructure/repositories/reactions.repository';

@Injectable()
export class SaReactionsRepository extends ReactionsRepository {
  constructor(
    @InjectModel(Reaction.name) protected reactionModel: ReactionModelType,
  ) {
    super(reactionModel);
  }

  async findByUserId(userId: string): Promise<ReactionDocument[] | null> {
    return this.reactionModel.find({ userId: userId });
  }
}
