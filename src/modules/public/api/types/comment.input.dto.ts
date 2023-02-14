import { IsString, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CommentInputDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 300)
  content: string;
}
