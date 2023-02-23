import { PostUpdateDto } from '../../../../../public/application/types/post.update.dto';
import { BlogIdPostIdInputDto } from '../../../../api/input.dto/blog-id-post-id-input.dto';

export class UpdatePostCommand {
  constructor(
    public readonly blogIdPostIdDto: BlogIdPostIdInputDto,
    public readonly postDto: PostUpdateDto,
  ) {}
}
