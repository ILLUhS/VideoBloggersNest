import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsString, Length } from 'class-validator';

export class BanUserInputDto {
  @IsBoolean()
  isBanned: boolean;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  banReason: string;
}
