import {
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { CheckOwnerDeviceInterceptor } from './interceptors/check.owner.device.interceptor';
import { SecurityDevicesQueryRepository } from '../../ifrastructure/query.repositories/security-devices-query.repository';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { DeleteSessionsExcludeCurrentCommand } from '../../application/use-cases/security-devices/commands/delete-sessions-exclude-current.command';
import { DeleteSessionCommand } from '../../application/use-cases/security-devices/commands/delete-session.command';

@SkipThrottle()
@Controller('/security/devices')
export class SecurityDevicesController {
  constructor(
    private commandBus: CommandBus,
    protected securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  @SkipThrottle()
  @UseGuards(RefreshAuthGuard)
  @Get()
  async getSessions(@Req() req: RequestWithUser) {
    return await this.securityDevicesQueryRepository.findSessionsByUserId(
      req.user.userId,
    );
  }

  @SkipThrottle()
  @UseGuards(RefreshAuthGuard)
  @HttpCode(204)
  @Delete()
  async deleteAllSessionsExcludeCurrent(@Req() req: RequestWithUser) {
    const result = await this.commandBus.execute<
      DeleteSessionsExcludeCurrentCommand,
      Promise<boolean>
    >(
      new DeleteSessionsExcludeCurrentCommand(
        req.user.userId,
        req.user.deviceId,
      ),
    );
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @SkipThrottle()
  @UseGuards(RefreshAuthGuard)
  @UseInterceptors(CheckOwnerDeviceInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteSessionById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const result = await this.commandBus.execute<
      DeleteSessionCommand,
      Promise<boolean>
    >(new DeleteSessionCommand(req.user.userId, id));
    if (!result) throw new InternalServerErrorException();
    return;
  }
}
