import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  @HttpCode(204)
  @Delete()
  async DeleteAll() {
    const collections = this.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    return;
  }
}
