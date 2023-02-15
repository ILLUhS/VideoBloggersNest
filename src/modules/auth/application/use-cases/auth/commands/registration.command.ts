import { UserInputDto } from '../../../../../public/application/types/user.input.dto';

export class RegistrationCommand {
  constructor(public readonly userDto: UserInputDto) {}
}
