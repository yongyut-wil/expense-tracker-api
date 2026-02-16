import { Email } from '../value-objects/email.vo';

/**
 * User Domain Entity
 * Represents a user in the system independent of database implementation
 */
export class User {
  constructor(
    public readonly id: number,
    public readonly email: Email,
    public readonly password: string,
    public readonly name: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Factory method to create a User entity
   */
  static create(data: {
    id: number;
    email: string;
    password: string;
    name?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      data.id,
      Email.create(data.email),
      data.password,
      data.name ?? null,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }

  /**
   * Creates a new user for registration (without ID)
   */
  static createNew(data: { email: string; password: string; name?: string }): {
    email: Email;
    password: string;
    name: string | null;
  } {
    return {
      email: Email.create(data.email),
      password: data.password,
      name: data.name ?? null,
    };
  }

  /**
   * Converts to plain object (for responses)
   */
  toPlainObject(): {
    id: number;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      email: this.email.value,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Converts to plain object without sensitive data
   */
  toSafeObject(): {
    id: number;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return this.toPlainObject();
  }

  /**
   * Checks if two users are the same
   */
  equals(other: User): boolean {
    if (!other) return false;
    return this.id === other.id;
  }
}
