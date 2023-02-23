import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../auth/ifrastructure/repositories/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../domain/schemas/user.schema';

@Injectable()
export class BUsersRepository extends UsersRepository {
  constructor(@InjectModel(User.name) protected userModel: UserModelType) {
    super(userModel);
  }
}
