import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../domain/schemas/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from '../auth/application/configs/email.config';
import { Blog, BlogSchema } from '../domain/schemas/blog.schema';
import { BlogRepository } from '../infrastructure/repositories/blog.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { SaBlogsController } from './api/controllers/sa-blogs.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from '../application/services/user.service';
import { UserIdValidator } from './api/validators/user-id.validator';
import { BindBlogWithUserUseCase } from './application/use-cases/bind-blog-with-user.use-case';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
  ],
  controllers: [SaBlogsController],
  providers: [
    UserService,
    UserRepository,
    BlogRepository,
    UserIdValidator,
    BindBlogWithUserUseCase,
  ],
})
export class SaModule {}
