import { UserInputDto } from '../../../../../public/application/types/user.input.dto';

export class CreateUserCommand {
  constructor(public readonly userDto: UserInputDto) {}
}
