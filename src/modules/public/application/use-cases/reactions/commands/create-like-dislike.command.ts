import { ReactionCreateDtoType } from '../../../types/reaction.create.dto.type';

export class CreateLikeDislikeCommand {
  constructor(public readonly reactionDto: ReactionCreateDtoType) {}
}
