import { InjectModel } from '@nestjs/mongoose';
import {
  PasswordRecovery,
  PasswordRecoveryDocument,
  PasswordRecoveryModelType,
} from '../../../../domain/schemas/password-recovery.schema';
import { Injectable } from '@nestjs/common';
import { PasswordRecoveryCreateDtoType } from '../../../public/application/types/password.recovery.create.dto.type';

@Injectable()
export class PasswordRecoveriesRepository {
  constructor(
    @InjectModel(PasswordRecovery.name)
    private passRecModel: PasswordRecoveryModelType,
  ) {}

  async create(
    PasswordRecoveryDto: PasswordRecoveryCreateDtoType,
  ): Promise<PasswordRecoveryDocument> {
    return await this.passRecModel.makeInstance(
      PasswordRecoveryDto,
      this.passRecModel,
    );
  }
  async findByUserId(userId: string): Promise<PasswordRecoveryDocument | null> {
    return this.passRecModel.findOne({ userId: userId });
  }
  async findByCode(code: string): Promise<PasswordRecoveryDocument | null> {
    return this.passRecModel.findOne({ recoveryCode: code });
  }
  async save(passRec: PasswordRecoveryDocument): Promise<boolean> {
    return !!(await passRec.save());
  }
  async deleteAll(): Promise<boolean> {
    return (await this.passRecModel.deleteMany().exec()).acknowledged;
  }
}
