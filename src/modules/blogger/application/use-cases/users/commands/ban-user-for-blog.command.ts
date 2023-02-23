import { BanUserForBlogInputDto } from '../../../../api/input.dto/ban-user-for-blog-input.dto';

export class BanUserForBlogCommand {
  constructor(
    public readonly userId: string,
    public readonly bloggerId: string,
    public readonly banDto: BanUserForBlogInputDto,
  ) {}
}
