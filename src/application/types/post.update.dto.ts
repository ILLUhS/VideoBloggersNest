import { IsString, IsUUID, Length, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { BlogIdValidator } from '../../api/controllers/validators/blog.id.validator';

export class PostUpdateDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  title: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 1000)
  content: string;

  @IsUUID(4)
  @Validate(BlogIdValidator)
  blogId: string;
}
