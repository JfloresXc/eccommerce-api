import { Injectable } from '@nestjs/common';
import { dataProducts } from '../products';

@Injectable()
export class ProductsMockRepository {
  private products = [...dataProducts.data];

  async create(data: any): Promise<any> {
    const newProduct = {
      ...data,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateMany(
    updates: { id: string; updateProductDto: any }[],
  ): Promise<{ modifiedCount: number }> {
    let modifiedCount = 0;
    for (const update of updates) {
      const index = this.products.findIndex(
        (p) => p._id === update.id || p.id?.toString() === update.id,
      );
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...update.updateProductDto };
        modifiedCount++;
      }
    }
    return { modifiedCount };
  }

  async findById(id: string): Promise<any | null> {
    return this.products.find((p) => p._id === id || p.id?.toString() === id) || null;
  }

  async findOne(filter: any): Promise<any | null> {
    return this.products.find((p) => this.matchFilter(p, filter)) || null;
  }

  async find(filter: any): Promise<any[]> {
    if (!filter || Object.keys(filter).length === 0) {
      return [...this.products];
    }
    return this.products.filter((p) => this.matchFilter(p, filter));
  }

  async findWithPagination(
    filter: any,
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }> {
    let filtered = this.products;

    if (filter && Object.keys(filter).length > 0) {
      filtered = this.products.filter((p) => this.matchFilter(p, filter));
    }

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const data = filtered.slice(skip, skip + limit);

    return { data, total };
  }

  async findWithSearch(
    searchTerm: string,
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }> {
    const term = searchTerm.toLowerCase();
    const filtered = this.products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term),
    );

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const data = filtered.slice(skip, skip + limit);

    return { data, total };
  }

  async update(id: string, data: any): Promise<any | null> {
    const index = this.products.findIndex(
      (p) => p._id === id || p.id?.toString() === id,
    );
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex(
      (p) => p._id === id || p.id?.toString() === id,
    );
    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    let deletedCount = 0;
    for (const id of ids) {
      const index = this.products.findIndex(
        (p) => p._id === id || p.id?.toString() === id,
      );
      if (index !== -1) {
        this.products.splice(index, 1);
        deletedCount++;
      }
    }
    return { deletedCount };
  }

  async findFeatured(): Promise<any[]> {
    return this.products.filter((p) => p.featured === true).slice(0, 10);
  }

  private matchFilter(product: any, filter: any): boolean {
    for (const key of Object.keys(filter)) {
      if (key === '$in' || key === '_id') continue;

      const filterValue = filter[key];

      if (filterValue && typeof filterValue === 'object' && filterValue.$in) {
        if (!filterValue.$in.includes(product[key])) return false;
      } else if (product[key] !== filterValue) {
        return false;
      }
    }
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
}
