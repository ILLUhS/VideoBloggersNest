import { IsString, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class EmailDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}
