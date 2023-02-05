import { IsEnum, IsString } from 'class-validator';

export class LikeStatusInputDto {
  @IsString()
  @IsEnum(['None', 'Like', 'Dislike'])
  likeStatus: string;
}
