import { BlogIdPostIdInputDto } from '../../../../api/input.dto/blog-id-post-id-input.dto';

export class DeletePostCommand {
  constructor(public readonly BlogIdPostIdDto: BlogIdPostIdInputDto) {}
}
