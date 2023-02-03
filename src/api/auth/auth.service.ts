import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../application/services/user.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMeta,
  RefreshTokenMetaModelType,
} from '../../domain/schemas/refreshTokenMetaSchema';
import { RefreshTokenMetaRepository } from '../../infrastructure/repositories/refresh.token.meta.repository';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../domain/schemas/user.schema';
import { UserInputDto } from '../../application/types/user.input.dto';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    @InjectModel(RefreshTokenMeta.name)
    private refreshTokenMetaModel: RefreshTokenMetaModelType,
    private refreshTokenMetaRepository: RefreshTokenMetaRepository,
    protected usersRepository: UserRepository,
    private usersService: UserService,
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
    await this.sendConfirmMail(user);
    await this.usersRepository.save(user);
  }
  async createAccessToken(user: any) {
    const payload = { userId: user.id, login: user.login, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
    };
  }
  async createRefreshToken(user: any, deviceName: string, deviceIp: string) {
    const payload = { deviceId: uuidv4(), userId: user.id, login: user.login };
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
  async getAuthUserInfo(user: any) {
    return { email: user.email, login: user.login, userId: user.id };
  }
  async cechCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersService.findUserByField(
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
  async sendConfirmMail(user: UserDocument) {
    const urlConfirmAddress = `https://video-bloggers-nest.app/confirm-email?code=`;
    // Отправка почты
    return await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Подтверждение регистрации',
        template: String.prototype.concat(
          __dirname,
          '/../auth/templates.email/',
          'confirmReg',
        ),
        context: {
          code: user.emailConfirmationCode,
          username: user.login,
          urlConfirmAddress,
        },
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
