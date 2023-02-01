import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BasicStrategy,
    LocalStrategy,
    UserService,
    JwtService,
    UserRepository,
  ],
})
export class AuthModule {}
