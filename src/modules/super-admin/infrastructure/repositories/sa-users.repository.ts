import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../domain/schemas/user.schema';
import { UsersRepository } from '../../../auth/ifrastructure/repositories/users.repository';

@Injectable()
export class SaUsersRepository extends UsersRepository {
  //объект с методами управления данными
  constructor(@InjectModel(User.name) protected userModel: UserModelType) {
    super(userModel);
  }

  async deleteById(id: string): Promise<boolean> {
    return (
      (await this.userModel.deleteOne({ id: id }).exec()).deletedCount === 1
    );
  }
  async deleteAll(): Promise<boolean> {
    return (await this.userModel.deleteMany().exec()).acknowledged;
  }
}
