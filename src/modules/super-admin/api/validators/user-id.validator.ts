import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { SaUsersService } from '../../application/services/sa-users.service';

@ValidatorConstraint({ name: 'userId', async: true })
@Injectable()
export class UserIdValidator implements ValidatorConstraintInterface {
  constructor(private usersService: SaUsersService) {}

  async validate(userId: string): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    return !!user;
  }
  defaultMessage() {
    return `userId incorrect`;
  }
}
