import { IsString, Length } from 'class-validator';

export class NewPassDto {
  @IsString()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  recoveryCode: string;
}
