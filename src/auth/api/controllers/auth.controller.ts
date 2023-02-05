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
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserInputDto } from '../../../application/types/user.input.dto';
import { EmailDto } from '../../types/email.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { NewPassDto } from '../../types/new.pass.dto';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  //LoginMiddleware - validate login and pass
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.authService.createAccessToken(req.user);
    const refreshToken = await this.authService.createRefreshToken(
      req.user,
      String(req.headers['user-agent']),
      req.ip,
    );
    return res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/auth/refresh-token',
      })
      .json(accessToken);
  }

  @SkipThrottle()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getAuthUser(@Req() req: Request) {
    return await this.authService.getAuthUserInfo(req.user);
  }

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
  @UseGuards(AuthGuard('refresh'))
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
  @UseGuards(AuthGuard('refresh'))
  @HttpCode(200)
  @Post('/refresh-token')
  async getNewRefreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = await this.authService.reCreateRefreshToken(
      req.user,
      req.ip,
    );
    return res.status(200).cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/auth/refresh-token',
    });
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
