import { IsString, IsUUID, Length } from 'class-validator';

export class PostCreateDto {
  @IsString()
  @Length(1, 30)
  title: string;

  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @Length(1, 1000)
  content: string;

  //@IsUUID(4)
  blogId: string;
}
