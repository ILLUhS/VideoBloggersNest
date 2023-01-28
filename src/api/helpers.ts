import { SortOrder } from 'mongoose';
import { QueryParamsType } from './types/query.params.type';

export const queryParamsValidation = async (query: QueryParamsType) => {
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
};
