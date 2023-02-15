import { Module } from '@nestjs/common';
import { BlogsQueryRepository } from './infrastructure/query.repositories/blogs-query.repository';
import { PostsQueryRepository } from './infrastructure/query.repositories/posts-query.repository';
import { BlogsController } from './api/controllers/blogs.controller';
import { PostsController } from './api/controllers/posts.controller';
import { CommentsController } from './api/controllers/comments.controller';
import { CommentsService } from './application/services/comments.service';
import { CreateCommentUseCase } from './application/use-cases/commenst/create-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/commenst/delete-comment.use-case';
import { UpdateCommentUseCase } from './application/use-cases/commenst/update-comment.use-case';
import { CreateLikeDislikeUseCase } from './application/use-cases/reactions/create-like-dislike.use-case';
import { CommentsQueryRepository } from './infrastructure/query.repositories/comments-query.repository';
import { BlogRepository } from './infrastructure/repositories/blog.repository';
import { PostsRepository } from './infrastructure/repositories/posts.repository';
import { CommentsRepository } from './infrastructure/repositories/comments.repository';
import { ReactionsRepository } from './infrastructure/repositories/reactions.repository';
import { AuthHeaderInterceptor } from './api/controllers/interceptors/auth.header.interceptor';
import { CheckOwnerCommentInterceptor } from './api/controllers/interceptors/check.owner.comment.interceptor';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../../domain/schemas/blog.schema';
import { Post, PostSchema } from '../../domain/schemas/post.schema';
import { Comment, CommentSchema } from '../../domain/schemas/comment.schema';
import { Reaction, ReactionSchema } from '../../domain/schemas/reaction.schema';
import { QueryTransformPipe } from './api/pipes/query-transform.pipe';

const useCases = [
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateLikeDislikeUseCase,
];
const services = [CommentsService];
const repositories = [
  BlogRepository,
  PostsRepository,
  CommentsRepository,
  ReactionsRepository,
];
const queryRepositories = [
  BlogsQueryRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
];
const interceptors = [AuthHeaderInterceptor, CheckOwnerCommentInterceptor];

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    ...useCases,
    ...services,
    ...repositories,
    ...queryRepositories,
    ...interceptors,
    QueryTransformPipe,
  ],
  exports: [...queryRepositories, MongooseModule, QueryTransformPipe],
})
export class PublicModule {}
