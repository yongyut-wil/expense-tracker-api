import { DomainException } from './domain.exception';

/**
 * Exception thrown when authentication credentials are invalid
 */
export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid credentials', 'INVALID_CREDENTIALS');
    this.name = 'InvalidCredentialsException';
  }
}
