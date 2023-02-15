import { CommentCreateDtoType } from '../../../types/comment.create.dto.type';

export class CreateCommentCommand {
  constructor(public readonly commentDto: CommentCreateDtoType) {}
}
