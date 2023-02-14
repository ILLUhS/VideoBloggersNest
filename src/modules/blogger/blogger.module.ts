import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../../domain/schemas/blog.schema';
import { CreateBlogUseCase } from './application/use-cases/blogs/create-blog.use-case';
import { DeleteBlogUseCase } from './application/use-cases/blogs/delete-blog.use-case';
import { UpdateBlogUseCase } from './application/use-cases/blogs/update-blog.use-case';
import { CreatePostUseCase } from './application/use-cases/posts/create-post.use-case';
import { UpdatePostUseCase } from './application/use-cases/posts/update-post.use-case';
import { DeletePostUseCase } from './application/use-cases/posts/delete-post.use-case';
import { BBlogsService } from './application/services/b-blogs.service';
import { BPostsService } from './application/services/b-posts.service';
import { BBlogsRepository } from './infrastructure/repositories/b-blogs.repository';
import { BPostsRepository } from './infrastructure/repositories/b-posts.repository';
import { BBlogsQueryRepository } from './infrastructure/query.repositories/b-blogs-query.repository';
import { BPostsQueryRepository } from './infrastructure/query.repositories/b-posts-query.repository';
import { BlogsPostsController } from './api/controllers/blogs-posts.controller';
import { PublicModule } from '../public/public.module';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
];
const services = [BBlogsService, BPostsService];
const repositories = [BBlogsRepository, BPostsRepository];
const queryRepositories = [BBlogsQueryRepository, BPostsQueryRepository];

@Module({
  imports: [
    AuthModule,
    PublicModule,
    CqrsModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsPostsController],
  providers: [...useCases, ...services, ...repositories, ...queryRepositories],
  exports: [...queryRepositories],
})
export class BloggerModule {}
