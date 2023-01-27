import { Controller, Get } from '@nestjs/common';

@Controller('blogs')
export class CatsController {
  @Get()
  findAll(): string {
    return 'Этот action вернет всех кошек';
  }
}
