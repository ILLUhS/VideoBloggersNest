import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { QueryRepository } from '../../infrastructure/query.repository';
import { UserService } from '../../application/services/user.service';
import { QueryParamsType } from '../types/query.params.type';
import { queryParamsValidation } from '../helpers';
import { Response } from 'express';
import { UserInputDto } from '../../application/types/user.input.dto';

@Controller('users')
export class UserController {
  constructor(
    protected queryRepository: QueryRepository,
    protected userService: UserService,
  ) {}
  @Get()
  async findAll(@Query() query: QueryParamsType) {
    const searchParams = await queryParamsValidation(query);
    return await this.queryRepository.getUsersWithQueryParam(searchParams);
  }
  @Post()
  async createUser(@Body() userDto: UserInputDto, @Res() res: Response) {
    const userId = await this.userService.createUser(userDto);
    if (!userDto) return res.sendStatus(400);
    return res
      .status(201)
      .json(await this.queryRepository.findUserById(userId));
  }
  @Delete(':id')
  async deleteUserById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.deleteUserById(id);
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
  }
}
