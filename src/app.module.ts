import { Module } from '@nestjs/common';
import { AppController } from './api/controllers/app.controller';
import { AppService } from './application/services/app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/schemas/blog.schema';
import { BlogRepository } from './modules/public/infrastructure/repositories/blog.repository';
import { BlogService } from './modules/public/application/services/blog.service';
import { PostRepository } from './modules/public/infrastructure/repositories/post.repository';
import { PostService } from './modules/public/application/services/post.service';
import { Post, PostSchema } from './domain/schemas/post.schema';
import { QueryRepository } from './modules/public/infrastructure/query.repository';
import { BlogController } from './modules/public/api/controllers/blog.controller';
import { Reaction, ReactionSchema } from './domain/schemas/reaction.schema';
import { Comment, CommentSchema } from './domain/schemas/comment.schema';
import { PostController } from './modules/public/api/controllers/post.controller';
import { CommentController } from './modules/public/api/controllers/comment.controller';
import { TestingAllDataController } from './api/controllers/testing.all.data.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AuthHeaderInterceptor } from './modules/public/api/controllers/interceptors/auth.header.interceptor';
import { CommentRepository } from './modules/public/infrastructure/repositories/comment.repository';
import { CommentService } from './modules/public/application/services/comment.service';
import { CheckOwnerCommentInterceptor } from './modules/public/api/controllers/interceptors/check.owner.comment.interceptor';
import { ReactionsRepository } from './modules/public/infrastructure/repositories/reaction.repository';
import { LikeService } from './modules/public/application/services/like.service';
import { PostIdValidator } from './modules/blogger/api/controllers/validators/post-id.validator';
import { SaModule } from './modules/super-admin/sa.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    SaModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    ThrottlerModule.forRootAsync({ useFactory: () => ({ ttl: 10, limit: 5 }) }),
  ],
  controllers: [
    AppController,
    BlogController,
    PostController,
    CommentController,
    TestingAllDataController,
  ],
  providers: [
    AppService,
    BlogService,
    PostService,
    CommentService,
    LikeService,
    BlogRepository,
    PostRepository,
    CommentRepository,
    ReactionsRepository,
    QueryRepository,
    AuthHeaderInterceptor,
    CheckOwnerCommentInterceptor,
    PostIdValidator,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
