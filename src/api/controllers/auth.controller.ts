import {
  BadRequestException,
  Body,
  Controller,
  Get,
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

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  //LoginMiddleware - validate login and pass
  @UseGuards(AuthGuard('local'))
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getAuthUser(@Req() req: Request) {
    return await this.authService.getAuthUserInfo(req.user);
  }

  @Post('/registration')
  async regUser(@Body() userDto: UserInputDto) {
    return await this.authService.createUser(userDto);
  }

  @Post('/registration-confirmation')
  async confirmUser(@Body('code') code: string) {
    const result = await this.authService.confirmEmail(code);
    if (!result) throw new BadRequestException();
    return;
  }

  @Post('/registration-email-resending')
  async resendRegEmail(@Body() emailDto: EmailDto) {
    const result = await this.authService.resendEmail(emailDto.email);
    if (!result) throw new BadRequestException();
    return;
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('logout')
  async logout(@Req() req: Request) {
    const result = await this.authService.deleteSession(req.user);
    if (!result) throw new BadRequestException();
    return;
  }
}
