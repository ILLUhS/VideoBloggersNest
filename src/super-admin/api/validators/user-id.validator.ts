import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../../application/services/user.service';

@ValidatorConstraint({ name: 'userId', async: true })
@Injectable()
export class UserIdValidator implements ValidatorConstraintInterface {
  constructor(private usersService: UserService) {}

  async validate(userId: string): Promise<boolean> {
    const foundUserId = await this.usersService.findUserById(userId);
    return !!foundUserId;
  }
  defaultMessage() {
    return `userId incorrect`;
  }
}
