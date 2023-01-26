import { Module } from '@nestjs/common';
import { AppController } from '../api/controllers/app.controller';
import { AppService } from '../application/services/app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
