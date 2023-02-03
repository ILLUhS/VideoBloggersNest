import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../domain/schemas/user.schema';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserInputDto } from '../types/user.input.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    protected usersRepository: UserRepository,
  ) {}
  async createUser(userDto: UserInputDto): Promise<string | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(
      userDto.password,
      passwordSalt,
    );
    const user = await this.userModel.makeInstanceByAdmin(
      {
        login: userDto.login,
        passwordHash: passwordHash,
        email: userDto.email,
      },
      this.userModel,
    );
    const result = await this.usersRepository.save(user);
    return result ? user.id : null;
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
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
