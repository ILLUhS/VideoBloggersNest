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
import { User, UserSchema } from '../domain/schemas/user.schema';
import { UserService } from '../application/services/user.service';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UserController } from '../api/controllers/user.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthHeaderInterceptor } from '../api/controllers/interceptors/auth.header.interceptor';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { CommentService } from '../application/services/comment.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    AppController,
    BlogController,
    PostController,
    CommentController,
    UserController,
    TestingAllDataController,
  ],
  providers: [
    AppService,
    BlogService,
    PostService,
    UserService,
    CommentService,
    BlogRepository,
    PostRepository,
    UserRepository,
    CommentRepository,
    QueryRepository,
    AuthHeaderInterceptor,
  ],
})
export class AppModule {}
