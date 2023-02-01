import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req: Request) {
    const token = await this.authService.login(req.user);
    return token;
  }
}
