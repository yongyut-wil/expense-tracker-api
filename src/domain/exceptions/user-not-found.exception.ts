import { DomainException } from './domain.exception';

/**
 * Exception thrown when a user is not found
 */
export class UserNotFoundException extends DomainException {
  constructor(identifier: string | number) {
    super(`User not found: ${identifier}`, 'USER_NOT_FOUND');
    this.name = 'UserNotFoundException';
  }
}
