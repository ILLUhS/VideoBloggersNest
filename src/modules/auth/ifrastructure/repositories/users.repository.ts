import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../../domain/schemas/user.schema';
import { UserCreateDtoType } from '../../../public/application/types/user.create.dto.type';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) protected userModel: UserModelType) {}

  async create(userDto: UserCreateDtoType): Promise<UserDocument> {
    return await this.userModel.makeInstance(userDto, this.userModel);
  }
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ id: id });
  }
  async findByField(
    field: string,
    value: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ [field]: value });
  }
  async save(user: UserDocument): Promise<boolean> {
    return !!(await user.save());
  }
}
