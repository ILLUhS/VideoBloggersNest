import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './commands/delete-user.command';
import { SaUsersRepository } from '../../../infrastructure/repositories/sa-users.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: SaUsersRepository) {}
  async execute(command: DeleteUserCommand): Promise<boolean> {
    const { id } = command;
    return await this.usersRepository.deleteById(id);
  }
}
