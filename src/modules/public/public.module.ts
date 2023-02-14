import { Module } from '@nestjs/common';
import { BlogsQueryRepository } from './infrastructure/query.repositories/blogs-query.repository';
import { PostsQueryRepository } from './infrastructure/query.repositories/posts-query.repository';

const useCases = [];
const services = [];
const repositories = [];
const queryRepositories = [BlogsQueryRepository, PostsQueryRepository];

@Module({
  imports: [],
  controllers: [],
  providers: [...queryRepositories],
  exports: [BlogsQueryRepository, PostsQueryRepository],
})
export class PublicModule {}
