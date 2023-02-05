import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Reaction,
  ReactionModelType,
} from '../../domain/schemas/reaction.schema';
import { ReactionsRepository } from '../../infrastructure/repositories/reaction.repository';
import { ReactionCreateDtoType } from '../types/reaction.create.dto.type';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: ReactionModelType,
    private reactionRepository: ReactionsRepository,
  ) {}
  async createLikeDislike(reactionDto: ReactionCreateDtoType) {
    const alreadyLike = await this.reactionRepository.find(
      reactionDto.entityId,
      reactionDto.userId,
    );
    if (alreadyLike) {
      alreadyLike.setStatus(reactionDto.reaction);
      return await this.reactionRepository.save(alreadyLike);
    }
    const newLike = this.reactionModel.makeInstance(
      reactionDto,
      this.reactionModel,
    );
    return await this.reactionRepository.save(newLike);
  }
}
