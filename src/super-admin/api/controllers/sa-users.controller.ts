import { SkipThrottle } from '@nestjs/throttler';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../guards/basic-auth.guard';
import { QueryTransformPipe } from '../../../auth/api/controllers/query-transform.pipe';
import { QueryParamsDto } from '../../../api/types/query-params.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SaUsersQueryRepository } from '../../infrastructure/query.repositories/sa-users-query.repository';

@SkipThrottle()
@Controller('sa/users')
export class SaUsersController {
  constructor(
    private commandBus: CommandBus,
    private saUsersQueryRepository: SaUsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findAll(@Query(new QueryTransformPipe()) query: QueryParamsDto) {
    return await this.saUsersQueryRepository.getUsersWithBanInfo(query);
  }
}
