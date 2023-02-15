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
import { QueryMapHelpers } from './modules/public/infrastructure/query.repositories/query-map.helpers';
import { BlogsController } from './modules/public/api/controllers/blogs.controller';
import { Reaction, ReactionSchema } from './domain/schemas/reaction.schema';
import { Comment, CommentSchema } from './domain/schemas/comment.schema';
import { PostsController } from './modules/public/api/controllers/posts.controller';
import { CommentsController } from './modules/public/api/controllers/comments.controller';
import { TestingAllDataController } from './api/controllers/testing.all.data.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AuthHeaderInterceptor } from './modules/public/api/controllers/interceptors/auth.header.interceptor';
import { CommentsRepository } from './modules/public/infrastructure/repositories/comments.repository';
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
    BlogsController,
    PostsController,
    CommentsController,
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
    CommentsRepository,
    ReactionsRepository,
    QueryMapHelpers,
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
