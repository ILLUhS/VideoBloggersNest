import { IsBoolean } from 'class-validator';

export class BanBlogInputDto {
  @IsBoolean()
  isBanned: boolean;
}
