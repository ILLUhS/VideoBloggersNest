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
import { UserService } from '../../application/services/user.service';
import { QueryParamsType } from '../types/query.params.type';
import { queryParamsValidation } from '../helpers';
import { UserInputDto } from '../../application/types/user.input.dto';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('users')
export class UserController {
  constructor(
    protected queryRepository: QueryRepository,
    protected userService: UserService,
  ) {}

  @UseGuards(AuthGuard('basic'))
  @Get()
  async findAll(@Query() query: QueryParamsType) {
    const searchParams = await queryParamsValidation(query);
    return await this.queryRepository.getUsersWithQueryParam(searchParams);
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
