import { Controller, Delete } from '@nestjs/common';
import mongoose from 'mongoose';

@Controller('testing/all-data')
export class TestingAllDataController {
  @Delete()
  async DeleteAll() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}
