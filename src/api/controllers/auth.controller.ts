import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginInputDto } from '../types/user.login.input.dto';
import { UserInputDto } from '../../application/types/user.input.dto';
import { EmailDto } from '../auth/types/email.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { NewPassDto } from '../auth/types/new.pass.dto';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  //LoginMiddleware - validate login and pass
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('/login')
  async login(
    @Body() userInputDto: UserLoginInputDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
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
    if (!result) throw new BadRequestException();
    return;
  }

  @HttpCode(204)
  @Post('/registration-email-resending')
  async resendRegEmail(@Body() emailDto: EmailDto) {
    const result = await this.authService.resendEmail(emailDto.email);
    if (!result) throw new BadRequestException();
    return;
  }

  @SkipThrottle()
  @UseGuards(AuthGuard('refresh'))
  @HttpCode(204)
  @Post('/logout')
  async logout(@Req() req: Request) {
    const result = await this.authService.deleteSession(req.user);
    if (!result) throw new BadRequestException();
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
    if (!result) throw new BadRequestException();
    return;
  }

  @HttpCode(204)
  @Post('/new-password')
  async newPass(@Body() newPassDto: NewPassDto) {
    const result = await this.authService.createNewPass(newPassDto);
    if (!result) throw new BadRequestException();
    return;
  }
}
