import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMeta,
  RefreshTokenMetaModelType,
} from '../../../../domain/schemas/refresh-token-meta.schema';
import { RefreshTokenMetasRepository } from '../../ifrastructure/repositories/refresh.token.metas.repository';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../../domain/schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { PasswordRecoveriesRepository } from '../../ifrastructure/repositories/password-recoveries.repository';
import {
  PasswordRecovery,
  PasswordRecoveryDocument,
  PasswordRecoveryModelType,
} from '../../../../domain/schemas/password-recovery.schema';
import { NewPassDto } from '../../types/new.pass.dto';
import { UsersRepository } from '../../ifrastructure/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    @InjectModel(RefreshTokenMeta.name)
    private refreshTokenMetaModel: RefreshTokenMetaModelType,
    @InjectModel(PasswordRecovery.name)
    private passRecModel: PasswordRecoveryModelType,
    private refreshTokenMetasRepository: RefreshTokenMetasRepository,
    private passRecRepository: PasswordRecoveriesRepository,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async getPassHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this.generateHash(password, passwordSalt);
  }
  async findUserByField(
    field: string,
    value: string,
  ): Promise<UserDocument | null> {
    return await this.usersRepository.findByField(field, value);
  }
  async createAccessToken(userId: string, login: string) {
    const payload = {
      userId: userId,
      login: login,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '10s',
    });
  }
  async createRefreshToken(userId: string, login: string, deviceId = uuidv4()) {
    return this.jwtService.sign(
      {
        deviceId: deviceId,
        userId: userId,
        login: login,
      },
      {
        secret: process.env.REFRESH_JWT_SECRET,
        expiresIn: '20s',
      },
    );
  }
  async getPayload(token: string) {
    return JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('ascii'),
    );
  }
  async checkPayloadRefreshToken(payload: any): Promise<boolean> {
    return await this.refreshTokenMetasRepository.find(
      payload.iat,
      payload.deviceId,
      payload.userId,
    );
  }
  async findSession(deviceId: string): Promise<string | null> {
    const session = await this.refreshTokenMetasRepository.findByDeviceId(
      deviceId,
    );
    return session ? session.userId : null;
  }
  async deleteSession(userId: string, deviceId: string) {
    return await this.refreshTokenMetasRepository.deleteByUserIdAndDeviceId(
      userId,
      deviceId,
    );
  }
  async deleteAllSessionsExcludeCurrent(userId: string, deviceId: string) {
    return await this.refreshTokenMetasRepository.deleteAllExceptCurrent(
      userId,
      deviceId,
    );
  }
  async cechCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersRepository.findByField(
      await this.isLoginOrEmail(loginOrEmail),
      loginOrEmail,
    );
    if (!user) return null;
    const passwordHash = await this.generateHash(
      password,
      user.passwordHash.substring(0, 30),
    );
    const confirmed = user.emailIsConfirmed;
    if (!confirmed) return null;
    return user.passwordHash === passwordHash ? user : null;
  }
  async createNewPass(newPassDto: NewPassDto): Promise<boolean> {
    const passRec = await this.passRecRepository.findByCode(
      newPassDto.recoveryCode,
    );
    if (!passRec) return false;
    const result = await passRec.recoveryConfirm();
    if (!result) return false;
    const user = await this.usersRepository.findById(passRec.userId);
    if (!user) return false;
    const passwordSalt = await bcrypt.genSalt(10);
    const newPassHash = await this.generateHash(
      newPassDto.newPassword,
      passwordSalt,
    );
    await user.setPassHash(newPassHash);
    return await this.usersRepository.save(user);
  }
  async sendConfirmEmail(user: UserDocument) {
    //const urlConfirmAddress = `https://video-bloggers-nest.app/confirm-email?code=`;
    const link = `https://video-bloggers.vercel.app/confirm-email?code=${user.emailConfirmationCode}`;
    // Отправка почты
    return await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Подтверждение регистрации',
        /*template: String.prototype.concat(
          __dirname,
          '/templates.email/',
          'confirmReg',
        ),
        context: {
          code: user.emailConfirmationCode,
          username: user.login,
          urlConfirmAddress,
        },*/
        html: `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href=${link}>complete registration</a>
        </p>`,
      })
      .catch((e) => {
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
  async sendRecoveryEmail(passRec: PasswordRecoveryDocument) {
    //const urlConfirmAddress = `https://video-bloggers-nest.app/password-recovery?recoveryCode=`;
    const link = `https://video-bloggers.vercel.app/password-recovery?recoveryCode=${passRec.recoveryCode}`;
    // Отправка почты
    return await this.mailerService
      .sendMail({
        to: passRec.email,
        subject: 'Подтверждение восстановления пароля',
        /*template: String.prototype.concat(
          __dirname,
          '/templates.email/',
          'confirmPassRecovery',
        ),
        context: {
          code: passRec.recoveryCode,
          urlConfirmAddress,
        },*/
        html: `<h1>You have chosen password recovery</h1>
        <p>To finish recovery please follow the link below:
            <a href=${link}>recovery password</a>
        </p>`,
      })
      .catch((e) => {
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
  private async isLoginOrEmail(loginOrEmail: string) {
    return loginOrEmail.includes('@') ? 'email' : 'login';
  }
}
