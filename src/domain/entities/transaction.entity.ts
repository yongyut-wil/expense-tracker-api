import { Money } from '../value-objects/money.vo';
import { TransactionType } from '../value-objects/transaction-type.vo';

/**
 * Transaction Domain Entity
 * Represents a financial transaction in the system
 */
export class Transaction {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly amount: Money,
    public readonly type: TransactionType,
    public readonly category: string,
    public readonly date: Date,
    public readonly userId: number,
  ) {}

  /**
   * Factory method to create a Transaction entity
   */
  static create(data: {
    id: number;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date?: Date;
    userId: number;
  }): Transaction {
    return new Transaction(
      data.id,
      data.title,
      Money.create(data.amount),
      TransactionType.create(data.type),
      data.category,
      data.date ?? new Date(),
      data.userId,
    );
  }

  /**
   * Creates a new transaction for creation (without ID)
   */
  static createNew(data: {
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date?: Date;
    userId: number;
  }): {
    title: string;
    amount: Money;
    type: TransactionType;
    category: string;
    date: Date;
    userId: number;
  } {
    return {
      title: data.title,
      amount: Money.create(data.amount),
      type: TransactionType.create(data.type),
      category: data.category,
      date: data.date ?? new Date(),
      userId: data.userId,
    };
  }

  /**
   * Checks if this is an income transaction
   */
  isIncome(): boolean {
    return this.type.isIncome();
  }

  /**
   * Checks if this is an expense transaction
   */
  isExpense(): boolean {
    return this.type.isExpense();
  }

  /**
   * Gets the signed amount (positive for income, negative for expense)
   */
  getSignedAmount(): number {
    return this.isIncome() ? this.amount.amount : -this.amount.amount;
  }

  /**
   * Converts to plain object (for responses)
   */
  toPlainObject(): {
    id: number;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date: Date;
    userId: number;
  } {
    return {
      id: this.id,
      title: this.title,
      amount: this.amount.amount,
      type: this.type.value,
      category: this.category,
      date: this.date,
      userId: this.userId,
    };
  }

  /**
   * Checks if the transaction belongs to a specific user
   */
  belongsTo(userId: number): boolean {
    return this.userId === userId;
  }

  /**
   * Checks if the transaction occurred within a date range
   */
  isWithinDateRange(startDate: Date, endDate: Date): boolean {
    return this.date >= startDate && this.date <= endDate;
  }

  /**
   * Checks if two transactions are the same
   */
  equals(other: Transaction): boolean {
    if (!other) return false;
    return this.id === other.id;
  }
}
