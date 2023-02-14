import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../domain/schemas/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { Blog, BlogSchema } from '../../domain/schemas/blog.schema';
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
import { BanUnbanUserUseCase } from './application/use-cases/users/ban-unban-user.use-case';
import { SaBlogsRepository } from './infrastructure/repositories/sa-blogs.repository';
import { BlogIdValidator } from './api/validators/blog.id.validator';
import { SaBlogsService } from './application/services/sa-blogs.service';
import {
  RefreshTokenMeta,
  RefreshTokenMetaSchema,
} from '../../domain/schemas/refresh-token-meta.schema';
import { SaRefreshTokenMetaRepository } from './infrastructure/repositories/sa-refresh-token-meta.repository';
import { AuthModule } from '../auth/auth.module';
import { QueryTransformPipe } from './api/pipes/query-transform.pipe';

const useCases = [
  BindBlogWithUserUseCase,
  CreateUserUseCase,
  BanUnbanUserUseCase,
];
const services = [SaUsersService, SaBlogsService];
const repositories = [
  SaUsersRepository,
  SaBlogsRepository,
  SaRefreshTokenMetaRepository,
];
const queryRepositories = [SaBlogsQueryRepository, SaUsersQueryRepository];
const validators = [UserIdValidator, BlogIdValidator];

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: RefreshTokenMeta.name, schema: RefreshTokenMetaSchema },
    ]),
  ],
  controllers: [SaBlogsController, SaUsersController],
  providers: [
    ...validators,
    ...services,
    ...useCases,
    ...repositories,
    ...queryRepositories,
    QueryTransformPipe,
  ],
  exports: [QueryTransformPipe],
})
export class SaModule {}
