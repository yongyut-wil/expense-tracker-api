import { User } from '../entities/user.entity';

/**
 * User Repository Interface (Port)
 * Defines the contract for user data access
 */
export interface IUserRepository {
  /**
   * Finds a user by their ID
   */
  findById(id: number): Promise<User | null>;

  /**
   * Finds a user by their email address
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Retrieves all users
   */
  findAll(): Promise<User[]>;

  /**
   * Creates a new user
   */
  create(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User>;

  /**
   * Updates an existing user
   */
  update(
    id: number,
    data: Partial<{
      email: string;
      password: string;
      name: string;
    }>,
  ): Promise<User>;

  /**
   * Deletes a user
   */
  delete(id: number): Promise<void>;

  /**
   * Checks if a user with the given email exists
   */
  existsByEmail(email: string): Promise<boolean>;
}

/**
 * Injection token for the User Repository
 */
export const IUserRepository = Symbol('IUserRepository');
