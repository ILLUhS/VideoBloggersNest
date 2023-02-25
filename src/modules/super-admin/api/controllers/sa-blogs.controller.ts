import { SkipThrottle } from '@nestjs/throttler';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryTransformPipe } from '../../../public/api/pipes/query-transform.pipe';
import { QueryParamsDto } from '../dto/query-params.dto';
import { BlogIdAndUserIdInputDto } from '../dto/blog-id-and-user-id-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BindBlogWithUserCommand } from '../../application/use-cases/blogs/commands/bind-blog-with-user.command';
import { BasicAuthGuard } from '../../../auth/api/controllers/guards/basic-auth.guard';
import { SaBlogsQueryRepository } from '../../infrastructure/query.repositories/sa-blogs-query.repository';
import { BanBlogInputDto } from '../dto/ban-blog-input-dto';
import { BanUnbanBlogCommand } from '../../application/use-cases/blogs/commands/ban-unban-blog.command';

@SkipThrottle()
@Controller('sa/blogs')
export class SaBlogsController {
  constructor(
    private commandBus: CommandBus,
    private saBlogsQueryRepository: SaBlogsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findAll(@Query(new QueryTransformPipe()) query: QueryParamsDto) {
    return await this.saBlogsQueryRepository.getBlogsWithOwnerInfo(query);
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

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id/ban')
  async banUnbanBlog(
    @Param('id') blogId: string,
    @Body() banBlogDto: BanBlogInputDto,
  ) {
    await this.commandBus.execute(
      new BanUnbanBlogCommand(blogId, banBlogDto.isBanned),
    );
    return;
  }
}
