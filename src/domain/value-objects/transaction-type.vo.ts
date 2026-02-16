/**
 * TransactionType Value Object
 * Represents the type of a transaction (INCOME or EXPENSE)
 */
export class TransactionType {
  private static readonly INCOME = 'INCOME';
  private static readonly EXPENSE = 'EXPENSE';

  private constructor(public readonly value: 'INCOME' | 'EXPENSE') {
    this.validate(value);
  }

  /**
   * Factory method to create a TransactionType
   */
  static create(type: 'INCOME' | 'EXPENSE'): TransactionType {
    return new TransactionType(type);
  }

  /**
   * Creates INCOME transaction type
   */
  static income(): TransactionType {
    return new TransactionType(this.INCOME);
  }

  /**
   * Creates EXPENSE transaction type
   */
  static expense(): TransactionType {
    return new TransactionType(this.EXPENSE);
  }

  /**
   * Validates transaction type
   */
  private validate(type: string): void {
    if (type !== TransactionType.INCOME && type !== TransactionType.EXPENSE) {
      throw new Error(
        `Invalid transaction type: ${type}. Must be INCOME or EXPENSE`,
      );
    }
  }

  /**
   * Checks if this is an income transaction
   */
  isIncome(): boolean {
    return this.value === TransactionType.INCOME;
  }

  /**
   * Checks if this is an expense transaction
   */
  isExpense(): boolean {
    return this.value === TransactionType.EXPENSE;
  }

  /**
   * Checks if two transaction types are equal
   */
  equals(other: TransactionType): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  /**
   * Returns string representation
   */
  toString(): string {
    return this.value;
  }
}
