import { IsString, IsUUID, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class PostCreateDto {
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
  blogId: string;
}
