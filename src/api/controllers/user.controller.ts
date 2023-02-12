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
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryRepository } from '../../infrastructure/query.repository';
import { SaUsersService } from '../../super-admin/application/services/sa-users.service';
import { QueryParamsDto } from '../types/query-params.dto';
import { UserInputDto } from '../../application/types/user.input.dto';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../../auth/api/controllers/query-transform.pipe';

@SkipThrottle()
@Controller('users')
export class UserController {
  constructor(
    protected queryRepository: QueryRepository,
    protected userService: SaUsersService,
  ) {}

  @UseGuards(AuthGuard('basic'))
  @Get()
  async findAll(@Query(new QueryTransformPipe()) query: QueryParamsDto) {
    return await this.queryRepository.getUsersWithQueryParam(query);
  }

  @UseGuards(AuthGuard('basic'))
  @Post()
  async createUser(@Body() userDto: UserInputDto) {
    const userId = await this.userService.createUser(userDto);
    if (!userId) throw new InternalServerErrorException();
    return await this.queryRepository.findUserById(userId);
  }

  @UseGuards(AuthGuard('basic'))
  @HttpCode(204)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    const result = await this.userService.deleteUserById(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
