import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../domain/schemas/blog.schema';

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
})
export class BloggerModule {}
