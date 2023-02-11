import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { QueryParamsDto } from '../../../api/types/query-params.dto';
import { SortOrder } from 'mongoose';

@Injectable()
export class QueryTransformPipe
  implements PipeTransform<QueryParamsDto, QueryParamsDto>
{
  transform(query: QueryParamsDto, metadata: ArgumentMetadata): QueryParamsDto {
    const searchNameTerm = query.searchNameTerm || '';
    const searchLoginTerm = query.searchLoginTerm || '';
    const searchEmailTerm = query.searchEmailTerm || '';
    const pageNumber = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    const sortBy = query.sortBy || 'createdAt';
    let sortDirection: SortOrder = 'desc';
    if (String(query.sortDirection) === 'asc') sortDirection = 'asc';
    return {
      searchNameTerm: String(searchNameTerm),
      searchLoginTerm: String(searchLoginTerm),
      searchEmailTerm: String(searchEmailTerm),
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      sortBy: String(sortBy),
      sortDirection: sortDirection,
    };
  }
}
