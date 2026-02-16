import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { UserNotFoundException } from '@domain/exceptions';

/**
 * User Repository Implementation
 * Implements the IUserRepository interface using Prisma
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return UserMapper.toDomainList(users);
  }

  async create(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name ?? null,
      },
    });
    return UserMapper.toDomain(user);
  }

  async update(
    id: number,
    data: Partial<{
      email: string;
      password: string;
      name: string;
    }>,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });
      return UserMapper.toDomain(user);
    } catch (error) {
      throw new UserNotFoundException(id);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new UserNotFoundException(id);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }
}
