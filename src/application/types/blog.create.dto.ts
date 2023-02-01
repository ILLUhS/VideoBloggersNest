import { IsString, IsUrl, Length, Matches } from 'class-validator';

export class BlogCreateDto {
  @IsString()
  @Length(1, 15)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  //@IsString()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  @Length(1, 100)
  /*@Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )*/
  websiteUrl: string;
}
