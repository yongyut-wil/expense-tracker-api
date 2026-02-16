import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { EmailAlreadyExistsException } from '@domain/exceptions';
import * as bcrypt from 'bcrypt';

/**
 * Register User Use Case
 * Handles user registration business logic
 */
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ user: User }> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException(data.email);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    return { user };
  }
}
