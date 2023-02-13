import { BanUserDtoType } from '../../../types/ban-user-dto.type';

export class BanUnbanUserCommand {
  constructor(public readonly banUserDto: BanUserDtoType) {}
}
