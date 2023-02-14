import { PostCreateDto } from '../../../../../public/application/types/post.create.dto';

export class CreatePostCommand {
  constructor(public readonly postDto: PostCreateDto) {}
}
