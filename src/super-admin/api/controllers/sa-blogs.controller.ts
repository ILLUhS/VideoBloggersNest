import { SkipThrottle } from '@nestjs/throttler';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryTransformPipe } from '../../../auth/api/controllers/query-transform.pipe';
import { QueryParamsDto } from '../../../api/types/query-params.dto';

@SkipThrottle()
@Controller('sa/blogs')
export class SaBlogsController {
  @Get()
  async findAll(@Query(new QueryTransformPipe()) query: QueryParamsDto) {
    //return await this.queryRepository.getBlogsWithQueryParam(query);
  }
}
