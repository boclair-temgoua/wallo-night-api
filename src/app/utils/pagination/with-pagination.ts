import { type } from 'os';
import { SortType } from './request-pagination.dto';

export type PaginationType = {
  page: number;
  take: number;
  sort: SortType;
  current_page: number;
  next_page: number;
  prev_page: number;
  count: number;
};

export const withPagination = async <T>(options: {
  value: T;
  rowCount?: number;
  pagination?: PaginationType;
}) => {
  const { rowCount, value, pagination } = { ...options };
  return {
    page: pagination?.page ?? 1,
    take: pagination?.take ?? 0,
    sort: pagination?.sort ?? 'DESC',
    current_page: pagination?.page ?? 1,
    next_page: pagination?.page + 1 ?? 1,
    prev_page: pagination?.page - 1 ?? 1,
    count: rowCount,
    total_pages: Math.ceil(rowCount / pagination.take),
    value,
  };
};
