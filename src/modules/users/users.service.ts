import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { usersData } from '../../database/mocks';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable()
export class UsersService {
  private users: User[] = [...usersData];

  findOneByEmail(email: string): User | null {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;

    return user;
  }

  async create(user: Partial<User>): Promise<any> {
    const hashedPassword = await bcrypt.hash(user?.password ?? '', 10);
    const newUser: User = {
      _id: this.generateId(),
      name: user.name ?? '',
      email: user.email ?? '',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
    this.users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    );
  }
}
