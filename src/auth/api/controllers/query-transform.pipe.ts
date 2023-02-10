import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { QueryParamsType } from '../../../api/types/queryParamsType';
import { SortOrder } from 'mongoose';

@Injectable()
export class QueryTransformPipe
  implements PipeTransform<QueryParamsType, QueryParamsType>
{
  transform(
    query: QueryParamsType,
    metadata: ArgumentMetadata,
  ): QueryParamsType {
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
