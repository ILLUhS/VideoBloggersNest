import { IsString, Matches } from 'class-validator';

export class EmailDto {
  @IsString()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}