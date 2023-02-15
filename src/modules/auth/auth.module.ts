import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicStrategy } from './api/controllers/guards/strategies/basic.strategy';
import { LocalStrategy } from './api/controllers/guards/strategies/local.strategy';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './api/controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../domain/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './api/controllers/guards/strategies/jwt.strategy';
import {
  RefreshTokenMeta,
  RefreshTokenMetaSchema,
} from '../../domain/schemas/refresh-token-meta.schema';
import { RefreshTokenMetasRepository } from './ifrastructure/repositories/refresh.token.metas.repository';
import { LoginMiddleware } from './api/controllers/middlewares/login.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from './application/configs/email.config';
import { RefreshStrategy } from './api/controllers/guards/strategies/refresh.strategy';
import { PasswordRecoveryRepository } from './ifrastructure/repositories/password.recovery.repository';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../../domain/schemas/password-recovery.schema';
import { SecurityDevicesController } from './api/controllers/security.devices.controller';
import { AuthQueryRepository } from './ifrastructure/query.repositories/auth.query.repository';
import { CheckOwnerDeviceInterceptor } from './api/controllers/interceptors/check.owner.device.interceptor';
import { CheckLoginEmailInterceptor } from './api/controllers/interceptors/check.login.email.interceptor';
import { UsersRepository } from './ifrastructure/repositories/users.repository';
import { BearerAuthGuard } from './api/controllers/guards/bearer-auth.guard';
import { BasicAuthGuard } from './api/controllers/guards/basic-auth.guard';
import { CheckBanUserInterceptor } from './api/controllers/interceptors/check-ban-user.interceptor';
import { LocalAuthGuard } from './api/controllers/guards/local-auth.guard';
import { RefreshAuthGuard } from './api/controllers/guards/refresh-auth.guard';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginUseCase } from './application/use-cases/auth/login.use-case';
import { CreateNewPairTokensUseCase } from './application/use-cases/auth/create-new-pair-tokens.use-case';

const useCases = [LoginUseCase, CreateNewPairTokensUseCase];
const services = [AuthService, JwtService];
const repositories = [
  UsersRepository,
  RefreshTokenMetasRepository,
  PasswordRecoveryRepository,
];
const queryRepositories = [AuthQueryRepository];
const strategies = [BasicStrategy, LocalStrategy, JwtStrategy, RefreshStrategy];
const guards = [
  BearerAuthGuard,
  BasicAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
];
const interceptors = [
  CheckOwnerDeviceInterceptor,
  CheckLoginEmailInterceptor,
  CheckBanUserInterceptor,
];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshTokenMeta.name, schema: RefreshTokenMetaSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
  ],
  controllers: [AuthController, SecurityDevicesController],
  providers: [
    ...useCases,
    ...services,
    ...repositories,
    ...queryRepositories,
    ...strategies,
    ...interceptors,
    ...guards,
  ],
  exports: [BearerAuthGuard, BasicAuthGuard, MongooseModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
