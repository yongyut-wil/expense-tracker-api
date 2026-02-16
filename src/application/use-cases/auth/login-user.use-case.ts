import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { InvalidCredentialsException } from '@domain/exceptions';
import * as bcrypt from 'bcrypt';

/**
 * JWT Payload interface
 */
export interface JwtPayload {
  userId: number;
  email: string;
}

/**
 * Auth Response interface
 */
export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

/**
 * Login User Use Case
 * Handles user login and JWT token generation
 */
@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generate JWT token
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email.value,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email.value,
        name: user.name,
      },
    };
  }
}
