import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../domain/schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

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
