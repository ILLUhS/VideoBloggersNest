import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshTokenMeta.name, schema: RefreshTokenMetaSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BasicStrategy,
    LocalStrategy,
    JwtStrategy,
    UserService,
    JwtService,
    UserRepository,
    RefreshTokenMetaRepository,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
