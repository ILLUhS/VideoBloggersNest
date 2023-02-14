import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMeta,
  RefreshTokenMetaModelType,
} from '../../../../domain/schemas/refresh-token-meta.schema';
import { RefreshTokenMetaRepository } from '../../ifrastructure/repositories/refresh.token.meta.repository';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../../domain/schemas/user.schema';
import { UserInputDto } from '../../../public/application/types/user.input.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { PasswordRecoveryRepository } from '../../ifrastructure/repositories/password.recovery.repository';
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
    private refreshTokenMetaRepository: RefreshTokenMetaRepository,
    private passRecRepository: PasswordRecoveryRepository,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async createUser(userDto: UserInputDto) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(
      userDto.password,
      passwordSalt,
    );
    const user = await this.userModel.makeInstance(
      {
        login: userDto.login,
        passwordHash: passwordHash,
        email: userDto.email,
      },
      this.userModel,
    );
    await this.sendConfirmEmail(user);
    await this.usersRepository.save(user);
  }
  async findUserByField(field: string, value: string) {
    const user = await this.usersRepository.findByField(field, value);
    return user ? user.id : null;
  }
  async createAccessToken(user: any) {
    const payload = {
      userId: user.userId,
      login: user.login,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '10s',
      }),
    };
  }
  async createRefreshToken(user: any, deviceName: string, deviceIp: string) {
    const payload = {
      deviceId: uuidv4(),
      userId: user.userId,
      login: user.login,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: '20s',
    });
    const getPayload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('ascii'),
    );

    await this.refreshTokenMetaRepository.save(
      await this.refreshTokenMetaModel.makeInstance(
        {
          issuedAt: getPayload.iat,
          expirationAt: getPayload.exp,
          deviceId: getPayload.deviceId,
          deviceIp: deviceIp,
          deviceName: deviceName,
          userId: getPayload.userId,
        },
        this.refreshTokenMetaModel,
      ),
    );
    return token;
  }
  async reCreateRefreshToken(payload: any, deviceIp: string) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: '20s',
    });
    const getPayload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('ascii'),
    );
    const tokenModel =
      await this.refreshTokenMetaRepository.findByUserIdAndDeviceId(
        payload.userId,
        payload.deviceId,
      );
    tokenModel.updateProperties({
      issuedAt: getPayload.iat,
      expirationAt: getPayload.exp,
      deviceIp,
    });
    await this.refreshTokenMetaRepository.save(tokenModel);
    return token;
  }
  async checkPayloadRefreshToken(payload: any): Promise<boolean> {
    return await this.refreshTokenMetaRepository.find(
      payload.iat,
      payload.deviceId,
      payload.userId,
    );
  }
  async findSession(deviceId: string): Promise<string | null> {
    const session = await this.refreshTokenMetaRepository.findByDeviceId(
      deviceId,
    );
    return session ? session.userId : null;
  }
  async deleteSession(userId: string, deviceId: string) {
    return await this.refreshTokenMetaRepository.deleteByUserIdAndDeviceId(
      userId,
      deviceId,
    );
  }
  async deleteAllSessionsExcludeCurrent(userId: string, deviceId: string) {
    return await this.refreshTokenMetaRepository.deleteAllExceptCurrent(
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
  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.usersRepository.findByField(
      'emailConfirmationCode',
      code,
    );
    if (!user) return false;
    const result = await user.confirmEmail();
    if (!result) return false;
    return await this.usersRepository.save(user);
  }
  async resendEmail(email: string) {
    const user = await this.usersRepository.findByField('email', email);
    if (!user) return false;
    await user.updEmailCode();
    if (await user.getEmailIsConfirmed()) return false;
    await this.sendConfirmEmail(user);
    await this.usersRepository.save(user);
    return true;
  }
  async createPassRecovery(email: string): Promise<boolean> {
    const user = await this.usersRepository.findByField('email', email);
    if (!user) return false;
    let passRec = await this.passRecRepository.findByUserId(user.id);
    if (!passRec)
      passRec = await this.passRecModel.makeInstance(
        { userId: user.id, email: email },
        this.passRecModel,
      );
    await this.sendRecoveryEmail(passRec);
    return this.passRecRepository.save(passRec);
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
    const urlConfirmAddress = `https://video-bloggers-nest.app/confirm-email?code=`;
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
    const urlConfirmAddress = `https://video-bloggers-nest.app/password-recovery?recoveryCode=`;
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
  async deleteAllRefreshTokMeta(): Promise<boolean> {
    return await this.refreshTokenMetaRepository.deleteAll();
  }
  async deleteAllPassRec(): Promise<boolean> {
    return await this.passRecRepository.deleteAll();
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
  private async isLoginOrEmail(loginOrEmail: string) {
    return loginOrEmail.includes('@') ? 'email' : 'login';
  }
}
