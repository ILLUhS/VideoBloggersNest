import { IsString, Length, Validate } from 'class-validator';
import { LoginOrEmailValidate } from '../auth/login.or.email.validate';

export class UserLoginInputDto {
  @IsString()
  @Validate(LoginOrEmailValidate)
  loginOrEmail: string;
  @IsString()
  @Length(6, 20)
  password: string;
}
