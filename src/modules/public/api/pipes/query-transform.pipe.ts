import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { SortOrder } from 'mongoose';

enum banSearch {
  'all',
  'banned',
  'notBanned',
}

@Injectable()
export class QueryTransformPipe
  implements PipeTransform<QueryParamsDto, QueryParamsDto>
{
  transform(query: QueryParamsDto, metadata: ArgumentMetadata): QueryParamsDto {
    let banStatus = query.banStatus || 'all';
    if (!Object.values(banSearch).includes(banStatus)) banStatus = 'all';
    const searchNameTerm = query.searchNameTerm || '';
    const searchLoginTerm = query.searchLoginTerm || '';
    const searchEmailTerm = query.searchEmailTerm || '';
    let pageNumber = query.pageNumber || 1;
    if (Number(pageNumber) < 1 || isNaN(Number(pageNumber))) pageNumber = 1;
    let pageSize = query.pageSize || 10;
    if (Number(pageSize) < 1 || isNaN(Number(pageSize))) pageSize = 10;
    let sortBy = query.sortBy || 'createdAt';
    if (sortBy.trim() === '') sortBy = 'createdAt';
    let sortDirection: SortOrder = 'desc';
    if (String(query.sortDirection) === 'asc') sortDirection = 'asc';
    return {
      banStatus: String(banStatus).trim(),
      searchNameTerm: String(searchNameTerm).trim(),
      searchLoginTerm: String(searchLoginTerm).trim(),
      searchEmailTerm: String(searchEmailTerm).trim(),
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      sortBy: String(sortBy).trim(),
      sortDirection: sortDirection,
    };
  }
}
