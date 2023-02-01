import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../domain/schemas/user.schema';
import { UserCreateDtoType } from '../types/user.create.dto.type';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    protected usersRepository: UserRepository,
  ) {}
  async createUser(userDto: UserCreateDtoType): Promise<string | null> {
    const newUser = await this.userModel.makeInstanceByAdmin(
      userDto,
      this.userModel,
    );
    const result = await this.usersRepository.save(newUser);
    return result ? newUser.id : null;
  }
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
