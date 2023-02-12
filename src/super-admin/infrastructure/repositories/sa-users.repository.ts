import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../domain/schemas/user.schema';

@Injectable()
export class SaUsersRepository {
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
  async deleteById(id: string): Promise<boolean> {
    return (
      (await this.userModel.deleteOne({ id: id }).exec()).deletedCount === 1
    );
  }
  async deleteAll(): Promise<boolean> {
    return (await this.userModel.deleteMany().exec()).acknowledged;
  }
  async save(user: UserDocument): Promise<boolean> {
    return !!(await user.save());
  }
}
