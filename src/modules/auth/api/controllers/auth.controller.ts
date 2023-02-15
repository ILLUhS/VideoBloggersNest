import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { Request, Response } from 'express';
import { UserInputDto } from '../../../public/application/types/user.input.dto';
import { EmailDto } from '../../types/email.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { NewPassDto } from '../../types/new.pass.dto';
import { CheckLoginEmailInterceptor } from './interceptors/check.login.email.interceptor';
import { AuthQueryRepository } from '../../ifrastructure/query.repositories/auth.query.repository';
import { CheckBanUserInterceptor } from './interceptors/check-ban-user.interceptor';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../../application/use-cases/auth/commands/login.command';
import { TokensType } from '../../application/types/tokens.type';
import { BearerAuthGuard } from './guards/bearer-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { CreateNewPairTokensCommand } from '../../application/use-cases/auth/commands/create-new-pair-tokens.command';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    protected authService: AuthService,
    protected authQueryRepository: AuthQueryRepository,
  ) {}

  //LoginMiddleware - validate login and pass
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(CheckBanUserInterceptor)
  @HttpCode(200)
  @Post('/login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const tokens = await this.commandBus.execute<
      LoginCommand,
      Promise<TokensType>
    >(
      new LoginCommand(
        req.user.userId,
        req.user.login,
        String(req.headers['user-agent']),
        req.ip,
      ),
    );
    return res
      .status(200)
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/auth/refresh-token',
      })
      .json({ accessToken: tokens.accessToken });
  }

  @SkipThrottle()
  @UseGuards(BearerAuthGuard)
  @Get('/me')
  async getAuthUser(@Req() req: Request) {
    const user = await this.authQueryRepository.findAuthUserById(
      req.user['userId'],
    );
    if (!user) throw new InternalServerErrorException();
    return user;
  }

  @UseInterceptors(CheckLoginEmailInterceptor)
  @HttpCode(204)
  @Post('/registration')
  async regUser(@Body() userDto: UserInputDto) {
    return await this.authService.createUser(userDto);
  }

  @HttpCode(204)
  @Post('/registration-confirmation')
  async confirmUser(@Body('code') code: string) {
    const result = await this.authService.confirmEmail(code);
    if (!result)
      throw new BadRequestException({
        message: [{ field: 'code', message: 'invalid code' }],
      });
    return;
  }

  @HttpCode(204)
  @Post('/registration-email-resending')
  async resendRegEmail(@Body() emailDto: EmailDto) {
    const result = await this.authService.resendEmail(emailDto.email);
    if (!result)
      throw new BadRequestException({
        message: [
          {
            field: 'email',
            message: 'invalid email',
          },
        ],
      });
    return;
  }

  @SkipThrottle()
  @UseGuards(RefreshAuthGuard)
  @HttpCode(204)
  @Post('/logout')
  async logout(@Req() req: Request) {
    const result = await this.authService.deleteSession(
      req.user['userId'],
      req.user['deviceId'],
    );
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @SkipThrottle()
  @UseGuards(RefreshAuthGuard)
  @HttpCode(200)
  @Post('/refresh-token')
  async getNewRefreshToken(@Req() req: RequestWithUser, @Res() res: Response) {
    const tokens = await this.commandBus.execute<
      CreateNewPairTokensCommand,
      Promise<TokensType>
    >(
      new CreateNewPairTokensCommand(
        req.user.userId,
        req.user.login,
        req.user.deviceId,
        req.ip,
      ),
    );
    return res
      .status(200)
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/auth/refresh-token',
      })
      .json({ accessToken: tokens.accessToken });
  }

  @HttpCode(204)
  @Post('/password-recovery')
  async passRecovery(@Body() emailDto: EmailDto) {
    const result = await this.authService.createPassRecovery(emailDto.email);
    if (!result)
      throw new BadRequestException({
        message: [
          {
            field: 'email',
            message: 'invalid email',
          },
        ],
      });
    return;
  }

  @HttpCode(204)
  @Post('/new-password')
  async newPass(@Body() newPassDto: NewPassDto) {
    const result = await this.authService.createNewPass(newPassDto);
    if (!result)
      throw new BadRequestException({
        message: [
          {
            field: 'recoveryCode',
            message: 'invalid recoveryCode',
          },
        ],
      });
    return;
  }
}
