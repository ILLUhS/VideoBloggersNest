import { IsUUID, Validate } from 'class-validator';
import { UserIdValidator } from '../validators/user-id.validator';
import { BlogIdValidator } from '../validators/blog.id.validator';

export class BlogIdAndUserIdInputDto {
  @IsUUID(4)
  @Validate(BlogIdValidator)
  id: string;

  @IsUUID(4)
  @Validate(UserIdValidator)
  userId: string;
}
