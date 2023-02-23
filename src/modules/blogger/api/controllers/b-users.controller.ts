import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { BanUserForBlogInputDto } from '../input.dto/ban-user-for-blog-input.dto';
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { BanUserForBlogCommand } from '../../application/use-cases/users/commands/ban-user-for-blog.command';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { QueryTransformPipe } from '../../../public/api/pipes/query-transform.pipe';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { BBlogsQueryRepository } from '../../infrastructure/query.repositories/b-blogs-query.repository';

@SkipThrottle()
@Controller('blogger/users')
export class BUsersController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BBlogsQueryRepository,
  ) {}

  @UseGuards(BearerAuthGuard)
  @Get('blog/:id')
  async findBannedUsersByBlog(
    @Param('id') blogId: string,
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
  ) {
    return await this.blogsQueryRepository.getBanUsersByBlogId(query, blogId);
  }

  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @Put(':id/ban')
  async banUnbanUser(
    @Param('id') id: string,
    @Body() banDto: BanUserForBlogInputDto,
    @Req() req: RequestWithUser,
  ) {
    await this.commandBus.execute(
      new BanUserForBlogCommand(id, req.user.userId, banDto),
    );
    return;
  }
}
