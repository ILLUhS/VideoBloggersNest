import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../../domain/schemas/user.schema';
import { SaUsersRepository } from '../../infrastructure/repositories/sa-users.repository';

@Injectable()
export class SaUsersService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    protected usersRepository: SaUsersRepository,
  ) {}
  async findUserById(userId: string): Promise<UserDocument | null> {
    return await this.usersRepository.findById(userId);
  }
  async findUserByField(
    field: string,
    value: string,
  ): Promise<UserDocument | null> {
    return await this.usersRepository.findByField(field, value);
  }
  async deleteUserById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteById(id);
  }
  async deleteAllUsers(): Promise<boolean> {
    return await this.usersRepository.deleteAll();
  }
}
