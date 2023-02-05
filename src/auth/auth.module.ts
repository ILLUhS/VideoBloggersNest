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
import { UserService } from '../application/services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../domain/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { JwtStrategy } from './api/controllers/guards/strategies/jwt.strategy';
import {
  RefreshTokenMeta,
  RefreshTokenMetaSchema,
} from '../domain/schemas/refreshTokenMetaSchema';
import { RefreshTokenMetaRepository } from './ifrastructure/repositories/refresh.token.meta.repository';
import { LoginMiddleware } from './api/controllers/middlewares/login.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from './application/configs/email.config';
import { RefreshStrategy } from './api/controllers/guards/strategies/refresh.strategy';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PasswordRecoveryRepository } from './ifrastructure/repositories/password.recovery.repository';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../domain/schemas/password.recovery.schema';
import { SecurityDevicesController } from './api/controllers/security.devices.controller';
import { AuthQueryRepository } from './ifrastructure/repositories/auth.query.repository';
import { CheckOwnerDeviceInterceptor } from './api/controllers/interceptors/check.owner.device.interceptor';

@Module({
  imports: [
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
    ThrottlerModule.forRootAsync({ useFactory: () => ({ ttl: 10, limit: 5 }) }),
  ],
  controllers: [AuthController, SecurityDevicesController],
  providers: [
    AuthService,
    BasicStrategy,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    UserService,
    JwtService,
    UserRepository,
    RefreshTokenMetaRepository,
    PasswordRecoveryRepository,
    AuthQueryRepository,
    CheckOwnerDeviceInterceptor,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
