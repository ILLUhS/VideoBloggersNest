import { SkipThrottle } from '@nestjs/throttler';
import {
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryTransformPipe } from '../../../auth/api/controllers/query-transform.pipe';
import { QueryParamsDto } from '../../../api/types/query-params.dto';
import { BlogIdAndUserIdInputDto } from '../dto/blog-id-and-user-id-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BindBlogWithUserCommand } from '../../application/use-cases/commands/bind-blog-with-user.command';
import { BasicAuthGuard } from '../guards/basic-auth.guard';

@SkipThrottle()
@Controller('sa/blogs')
export class SaBlogsController {
  constructor(private commandBus: CommandBus) {}
  @Get()
  async findAll(@Query(new QueryTransformPipe()) query: QueryParamsDto) {
    //return await this.queryRepository.getBlogsWithQueryParam(query);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id/bind-with-user/:userId')
  async bindingUser(@Param() idsInputDto: BlogIdAndUserIdInputDto) {
    await this.commandBus.execute(
      new BindBlogWithUserCommand(idsInputDto.id, idsInputDto.userId),
    );
    return;
  }
}
