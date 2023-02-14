import { Module } from '@nestjs/common';
import { AppController } from '../api/controllers/app.controller';
import { AppService } from '../application/services/app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../domain/schemas/blog.schema';
import { BlogRepository } from '../infrastructure/repositories/blog.repository';
import { BlogService } from '../application/services/blog.service';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { PostService } from '../application/services/post.service';
import { Post, PostSchema } from '../domain/schemas/post.schema';
import { QueryRepository } from '../infrastructure/query.repository';
import { BlogController } from '../api/controllers/blog.controller';
import { Reaction, ReactionSchema } from '../domain/schemas/reaction.schema';
import { Comment, CommentSchema } from '../domain/schemas/comment.schema';
import { PostController } from '../api/controllers/post.controller';
import { CommentController } from '../api/controllers/comment.controller';
import { TestingAllDataController } from '../api/controllers/testing.all.data.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthHeaderInterceptor } from '../api/controllers/interceptors/auth.header.interceptor';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { CommentService } from '../application/services/comment.service';
import { CheckOwnerCommentInterceptor } from '../api/controllers/interceptors/check.owner.comment.interceptor';
import { ReactionsRepository } from '../infrastructure/repositories/reaction.repository';
import { LikeService } from '../application/services/like.service';
import { PostIdValidator } from '../blogger/api/controllers/validators/post-id.validator';
import { SaModule } from '../super-admin/sa.module';
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
