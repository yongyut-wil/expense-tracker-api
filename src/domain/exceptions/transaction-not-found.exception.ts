import { DomainException } from './domain.exception';

/**
 * Exception thrown when a transaction is not found
 */
export class TransactionNotFoundException extends DomainException {
  constructor(identifier: string | number) {
    super(`Transaction not found: ${identifier}`, 'TRANSACTION_NOT_FOUND');
    this.name = 'TransactionNotFoundException';
  }
}
