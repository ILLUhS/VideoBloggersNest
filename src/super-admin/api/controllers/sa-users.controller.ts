import { SkipThrottle } from '@nestjs/throttler';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../guards/basic-auth.guard';
import { QueryTransformPipe } from '../../../auth/api/controllers/query-transform.pipe';
import { QueryParamsDto } from '../../../api/types/query-params.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SaUsersQueryRepository } from '../../infrastructure/query.repositories/sa-users-query.repository';
import { UserInputDto } from '../../../application/types/user.input.dto';
import { CreateUserCommand } from '../../application/use-cases/users/commands/create-user.command';
import { DeleteUserCommand } from '../../application/use-cases/users/commands/delete-user.command';

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

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() userDto: UserInputDto) {
    const userId = await this.commandBus.execute<
      CreateUserCommand,
      Promise<string>
    >(new CreateUserCommand(userDto));
    if (!userId) throw new InternalServerErrorException();
    return await this.saUsersQueryRepository.findUserById(userId);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id/ban')
  async banUnbanUser(@Param('id') id: string) {}

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    const result = await this.commandBus.execute<
      DeleteUserCommand,
      Promise<boolean>
    >(new DeleteUserCommand(id));
    if (!result) throw new NotFoundException();
    return;
  }
}
