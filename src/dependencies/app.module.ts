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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],
  controllers: [AppController, BlogController],
  providers: [
    AppService,
    QueryRepository,
    BlogService,
    BlogRepository,
    PostService,
    PostRepository,
  ],
})
export class AppModule {}
