import { IsUUID, Validate } from 'class-validator';
import { BlogIdValidator } from '../../../api/controllers/validators/blog.id.validator';
import { UserIdValidator } from '../validators/user-id.validator';

export class BlogIdAndUserIdInputDto {
  @IsUUID(4)
  @Validate(BlogIdValidator)
  id: string;

  @IsUUID(4)
  @Validate(UserIdValidator)
  userId: string;
}
