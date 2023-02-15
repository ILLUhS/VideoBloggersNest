import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PassRecoveryCommand } from './commands/pass-recovery.command';
import { UsersRepository } from '../../../ifrastructure/repositories/users.repository';
import { PasswordRecoveriesRepository } from '../../../ifrastructure/repositories/password-recoveries.repository';
import { AuthService } from '../../services/auth.service';

@CommandHandler(PassRecoveryCommand)
export class PassRecoveryUseCase
  implements ICommandHandler<PassRecoveryCommand>
{
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository,
    private passRecRepository: PasswordRecoveriesRepository,
  ) {}

  async execute(command: PassRecoveryCommand): Promise<boolean> {
    const { email } = command;
    const user = await this.usersRepository.findByField('email', email);
    if (!user) return false;
    let passRec = await this.passRecRepository.findByUserId(user.id);
    if (!passRec)
      passRec = await this.passRecRepository.create({
        userId: user.id,
        email: email,
      });
    await this.authService.sendRecoveryEmail(passRec);
    return this.passRecRepository.save(passRec);
  }
}
