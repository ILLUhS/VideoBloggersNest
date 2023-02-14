import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../../domain/schemas/user.schema';
import { SaUsersRepository } from '../../../infrastructure/repositories/sa-users.repository';
import { CreateUserCommand } from './commands/create-user.command';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    protected usersRepository: SaUsersRepository,
  ) {}
  async execute(command: CreateUserCommand): Promise<string | null> {
    const { userDto } = command;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(
      userDto.password,
      passwordSalt,
    );
    const user = await this.userModel.makeInstance(
      {
        login: userDto.login,
        passwordHash: passwordHash,
        email: userDto.email,
      },
      this.userModel,
    );
    await user.confirmEmail();
    const result = await this.usersRepository.save(user);
    return result ? user.id : null;
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
