import { BlogCreateDto } from '../../../../../application/types/blog.create.dto';
import { UserInfoType } from '../../../../types/user-info.type';

export class CreateBlogCommand {
  constructor(
    public readonly blogDto: BlogCreateDto,
    public readonly userInfo: UserInfoType,
  ) {}
}
