import { CommentUpdateDto } from '../../../types/comment.update.dto';

export class UpdateCommentCommand {
  constructor(
    public readonly id: string,
    public readonly commentDto: CommentUpdateDto,
  ) {}
}
