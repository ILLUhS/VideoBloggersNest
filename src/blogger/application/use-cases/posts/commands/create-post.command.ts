import { PostCreateDto } from '../../../../../application/types/post.create.dto';

export class CreatePostCommand {
  constructor(public readonly postDto: PostCreateDto) {}
}
