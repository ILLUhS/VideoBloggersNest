import { UserInputDto } from '../../../../application/types/user.input.dto';

export class CreateUserCommand {
  constructor(public readonly userDto: UserInputDto) {}
}
