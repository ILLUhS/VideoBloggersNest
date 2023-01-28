import { SortOrder } from 'mongoose';

export type QueryParamsType = {
  searchNameTerm: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortOrder;
};
