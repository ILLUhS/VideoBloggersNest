import { BlogUpdateDto } from '../../../../../public/application/types/blog.update.dto';

export class UpdateBlogCommand {
  constructor(
    public readonly id: string,
    public readonly blogDto: BlogUpdateDto,
  ) {}
}
