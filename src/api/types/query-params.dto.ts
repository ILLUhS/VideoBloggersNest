import { SortOrder } from 'mongoose';
import { Allow } from 'class-validator';

export class QueryParamsDto {
  @Allow()
  banStatus: string;
  @Allow()
  searchNameTerm: string;
  @Allow()
  searchLoginTerm: string;
  @Allow()
  searchEmailTerm: string;
  @Allow()
  pageNumber: number;
  @Allow()
  pageSize: number;
  @Allow()
  sortBy: string;
  @Allow()
  sortDirection: SortOrder;
}
