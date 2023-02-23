import { BanUserInputDto } from '../../../super-admin/api/dto/ban-user-input.dto';
import { IsUUID, Validate } from 'class-validator';
import { BBlogIdValidator } from '../controllers/validators/b-blog.id.validator';

export class BanUserForBlogInputDto extends BanUserInputDto {
  @IsUUID(4)
  @Validate(BBlogIdValidator)
  blogId: string;
}
