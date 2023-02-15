import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendEmailCommand } from './commands/resend-email.command';
import { UsersRepository } from '../../../ifrastructure/repositories/users.repository';
import { AuthService } from '../../services/auth.service';

@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase implements ICommandHandler<ResendEmailCommand> {
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: ResendEmailCommand): Promise<boolean> {
    const { email } = command;
    const user = await this.usersRepository.findByField('email', email);
    if (!user) return false;
    await user.updEmailCode();
    if (await user.getEmailIsConfirmed()) return false;
    await this.authService.sendConfirmEmail(user);
    await this.usersRepository.save(user);
    return true;
  }
}
