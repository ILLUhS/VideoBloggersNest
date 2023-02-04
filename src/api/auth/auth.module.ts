import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicStrategy } from './strategies/basic.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserService } from '../../application/services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../domain/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import {
  RefreshTokenMeta,
  RefreshTokenMetaSchema,
} from '../../domain/schemas/refreshTokenMetaSchema';
import { RefreshTokenMetaRepository } from '../../infrastructure/repositories/refresh.token.meta.repository';
import { LoginMiddleware } from './login.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from '../../configs/email.config';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PasswordRecoveryRepository } from '../../infrastructure/repositories/password.recovery.repository';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../../domain/schemas/password.recovery.schema';

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
  controllers: [AuthController],
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
