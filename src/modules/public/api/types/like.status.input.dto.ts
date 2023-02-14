import { IsEnum, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class LikeStatusInputDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(['None', 'Like', 'Dislike'])
  likeStatus: string;
}
