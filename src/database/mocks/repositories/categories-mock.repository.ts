import { Injectable } from '@nestjs/common';
import { categoriesData } from '../categories';

@Injectable()
export class CategoriesMockRepository {
  private categories = [...categoriesData];

  async create(data: any): Promise<any> {
    const newCategory = {
      ...data,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async findById(id: string): Promise<any | null> {
    return this.categories.find((c) => c._id === id || c.id?.toString() === id) || null;
  }

  async findOne(filter: any): Promise<any | null> {
    return this.categories.find((c) => this.matchFilter(c, filter)) || null;
  }

  async find(filter: any): Promise<any[]> {
    if (!filter || Object.keys(filter).length === 0) {
      return [...this.categories];
    }
    return this.categories.filter((c) => this.matchFilter(c, filter));
  }

  async findWithPagination(
    filter: any,
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }> {
    let filtered = this.categories;

    if (filter && Object.keys(filter).length > 0) {
      filtered = this.categories.filter((c) => this.matchFilter(c, filter));
    }

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const data = filtered.slice(skip, skip + limit);

    return { data, total };
  }

  async update(id: string, data: any): Promise<any | null> {
    const index = this.categories.findIndex(
      (c) => c._id === id || c.id?.toString() === id,
    );
    if (index === -1) return null;

    this.categories[index] = { ...this.categories[index], ...data };
    return this.categories[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.categories.findIndex(
      (c) => c._id === id || c.id?.toString() === id,
    );
    if (index === -1) return false;

    this.categories.splice(index, 1);
    return true;
  }

  async updateMany(filter: any, data: any): Promise<any> {
    let modifiedCount = 0;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.matchFilter(this.categories[i], filter)) {
        this.categories[i] = { ...this.categories[i], ...data };
        modifiedCount++;
      }
    }
    return { modifiedCount };
  }

  private matchFilter(category: any, filter: any): boolean {
    for (const key of Object.keys(filter)) {
      if (key === '_id' && filter[key]?.$in) {
        if (!filter[key].$in.includes(category._id)) return false;
        continue;
      }

      const filterValue = filter[key];

      if (filterValue && typeof filterValue === 'object' && filterValue.$in) {
        if (!filterValue.$in.includes(category[key])) return false;
      } else if (category[key] !== filterValue) {
        return false;
      }
    }
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
}
