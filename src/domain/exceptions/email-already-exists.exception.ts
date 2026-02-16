import { DomainException } from './domain.exception';

/**
 * Exception thrown when email already exists in the system
 */
export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`Email already exists: ${email}`, 'EMAIL_ALREADY_EXISTS');
    this.name = 'EmailAlreadyExistsException';
  }
}
