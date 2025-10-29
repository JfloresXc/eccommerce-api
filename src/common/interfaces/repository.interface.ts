import { FilterQuery, UpdateQuery } from 'mongoose';

export interface IRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  findWithPagination(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
  ): Promise<{ data: T[]; total: number }>;
  update(id: string, data: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
