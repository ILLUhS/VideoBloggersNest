import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../domain/schemas/user.schema';
import { UserCreateDtoType } from '../types/user.create.dto.type';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    protected usersRepository: UserRepository,
  ) {}
  async createUser(userDto: UserCreateDtoType) {
    const newUser = await this.userModel.makeInstanceByAdmin(
      userDto,
      this.userModel,
    );
    const result = await this.usersRepository.save(newUser);
    return result ? newUser.id : null;
  }
  async deleteUserById(id: string) {
    return await this.usersRepository.deleteById(id);
  }
  async deleteAllUsers() {
    return await this.usersRepository.deleteAll();
  }
}
