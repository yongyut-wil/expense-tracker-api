import { User as PrismaUser } from '@prisma/client';
import { User } from '@domain/entities/user.entity';

/**
 * Mapper for converting between Pris ma User model and Domain User entity
 */
export class UserMapper {
  /**
   * Converts Prisma User to Domain User entity
   */
  static toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      name: prismaUser.name,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  /**
   * Converts Domain User entity to Prisma User model data
   */
  static toPrisma(
    user: User,
  ): Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      email: user.email.value,
      password: user.password,
      name: user.name,
    };
  }

  /**
   * Converts array of Prisma Users to Domain Users
   */
  static toDomainList(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map((user) => this.toDomain(user));
  }
}
