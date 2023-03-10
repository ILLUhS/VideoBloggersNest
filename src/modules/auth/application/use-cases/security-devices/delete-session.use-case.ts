import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSessionCommand } from './commands/delete-session.command';
import { SecurityDevicesService } from '../../services/security-devices.service';

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private securityDevicesService: SecurityDevicesService) {}

  async execute(command: DeleteSessionCommand): Promise<boolean> {
    const { userId, deviceId } = command;
    return await this.securityDevicesService.deleteSession(userId, deviceId);
  }
}
