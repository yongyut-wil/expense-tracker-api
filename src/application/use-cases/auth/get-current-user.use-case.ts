import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { UserNotFoundException } from '@domain/exceptions';

/**
 * Get Current User Use Case
 * Retrieves the current authenticated user
 */
@Injectable()
export class GetCurrentUserUseCase {
    constructor(
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userId: number): Promise<User> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new UserNotFoundException(userId);
        }

        return user;
    }
}
