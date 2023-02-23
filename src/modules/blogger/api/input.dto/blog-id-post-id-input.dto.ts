import { IsUUID, Validate } from 'class-validator';
import { BlogIdValidator } from '../../../super-admin/api/validators/blog.id.validator';
import { PostIdValidator } from '../controllers/validators/post-id.validator';

export class BlogIdPostIdInputDto {
  @IsUUID(4)
  @Validate(BlogIdValidator)
  blogId: string;

  @IsUUID(4)
  @Validate(PostIdValidator)
  postId: string;
}
