import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../domain/schemas/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from '../auth/application/configs/email.config';
import { Blog, BlogSchema } from '../domain/schemas/blog.schema';
import { BlogRepository } from '../infrastructure/repositories/blog.repository';
import { SaUsersRepository } from './infrastructure/repositories/sa-users.repository';
import { SaBlogsController } from './api/controllers/sa-blogs.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { SaUsersService } from './application/services/sa-users.service';
import { UserIdValidator } from './api/validators/user-id.validator';
import { BindBlogWithUserUseCase } from './application/use-cases/blogs/bind-blog-with-user.use-case';
import { SaBlogsQueryRepository } from './infrastructure/query.repositories/sa-blogs-query.repository';
import { SaUsersController } from './api/controllers/sa-users.controller';
import { SaUsersQueryRepository } from './infrastructure/query.repositories/sa-users-query.repository';
import { CreateUserUseCase } from './application/use-cases/users/create-user.use-case';
import { BanUnbanUserUseCase } from './application/use-cases/users/banUnbanUser.use-case';

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
  controllers: [SaBlogsController, SaUsersController],
  providers: [
    SaUsersService,
    SaUsersRepository,
    SaBlogsQueryRepository,
    SaUsersQueryRepository,
    BlogRepository,
    UserIdValidator,
    BindBlogWithUserUseCase,
    CreateUserUseCase,
    BanUnbanUserUseCase,
  ],
})
export class SaModule {}
