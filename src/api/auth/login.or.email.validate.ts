import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'LoginOrEmail', async: true })
@Injectable()
export class LoginOrEmailValidate implements ValidatorConstraintInterface {
  async validate(value: string) {
    if (value.includes('@')) {
      if (value.search('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$') === -1)
        return false;
    } else if (
      value.search('^[a-zA-Z0-9_-]*$') === -1 ||
      value.length < 3 ||
      value.length > 10
    )
      return false;
    return true;
  }

  defaultMessage() {
    return `LoginOrEmail incorrect`;
  }
}
