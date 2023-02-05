import { IsString, IsUUID, Length, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { BlogIdValidate } from '../../api/controllers/validators/blog.id.validate';

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
  @Validate(BlogIdValidate)
  blogId: string;
}
