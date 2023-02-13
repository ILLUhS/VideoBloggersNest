import {
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthQueryRepository } from '../../ifrastructure/query.repositories/auth.query.repository';
import { CheckOwnerDeviceInterceptor } from './interceptors/check.owner.device.interceptor';

@SkipThrottle()
@Controller('/security/devices')
export class SecurityDevicesController {
  constructor(
    protected authService: AuthService,
    protected authQueryRepository: AuthQueryRepository,
  ) {}

  @SkipThrottle()
  @UseGuards(AuthGuard('refresh'))
  @Get()
  async getSessions(@Req() req: Request) {
    return await this.authQueryRepository.findSessionsByUserId(
      req.user['userId'],
    );
  }

  @SkipThrottle()
  @UseGuards(AuthGuard('refresh'))
  @HttpCode(204)
  @Delete()
  async deleteAllSessionsExcludeCurrent(@Req() req: Request) {
    const result = await this.authService.deleteAllSessionsExcludeCurrent(
      req.user['userId'],
      req.user['deviceId'],
    );
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @SkipThrottle()
  @UseGuards(AuthGuard('refresh'))
  @UseInterceptors(CheckOwnerDeviceInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteSessionById(@Param('id') id: string, @Req() req: Request) {
    const result = await this.authService.deleteSession(req.user['userId'], id);
    if (!result) throw new NotFoundException();
    return;
  }
}
