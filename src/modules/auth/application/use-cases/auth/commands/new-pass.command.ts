import { NewPassDto } from '../../../../types/new.pass.dto';

export class NewPassCommand {
  constructor(public readonly newPassDto: NewPassDto) {}
}
