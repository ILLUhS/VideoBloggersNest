import { InjectModel } from '@nestjs/mongoose';
import {
  PasswordRecovery,
  PasswordRecoveryDocument,
  PasswordRecoveryModelType,
} from '../../../../domain/schemas/password.recovery.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordRecoveryRepository {
  constructor(
    @InjectModel(PasswordRecovery.name)
    private passRecModel: PasswordRecoveryModelType,
  ) {}

  async findByUserId(userId: string): Promise<PasswordRecoveryDocument | null> {
    return this.passRecModel.findOne({ userId: userId });
  }
  async findByCode(code: string): Promise<PasswordRecoveryDocument | null> {
    return this.passRecModel.findOne({ recoveryCode: code });
  }
  async save(passRec: PasswordRecoveryDocument): Promise<boolean> {
    return !!(await passRec.save());
  }
}
