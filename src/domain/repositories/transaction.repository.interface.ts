import { Transaction } from '../entities/transaction.entity';

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  previousMonthIncome: number;
  previousMonthExpense: number;
  incomeChange: number;
  incomeChangePercent: number;
  expenseChange: number;
  expenseChangePercent: number;
}

/**
 * Transaction Repository Interface (Port)
 * Defines the contract for transaction data access
 */
export interface ITransactionRepository {
  /**
   * Finds a transaction by its ID
   */
  findById(id: number): Promise<Transaction | null>;

  /**
   * Finds all transactions for a specific user
   */
  findByUserId(userId: number): Promise<Transaction[]>;

  /**
   * Finds transactions within a date range for a user
   */
  findByDateRange(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]>;

  /**
   * Creates a new transaction
   */
  create(data: {
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date?: Date;
    userId: number;
  }): Promise<Transaction>;

  /**
   * Updates an existing transaction
   */
  update(
    id: number,
    data: Partial<{
      title: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      category: string;
      date: Date;
    }>,
  ): Promise<Transaction>;

  /**
   * Deletes a transaction
   */
  delete(id: number): Promise<void>;

  /**
   * Gets dashboard statistics for a user
   */
  getDashboardStats(userId: number): Promise<DashboardStats>;

  /**
   * Counts transactions for a user within a date range
   */
  count(userId: number, startDate?: Date, endDate?: Date): Promise<number>;
}

/**
 * Injection token for the Transaction Repository
 */
export const ITransactionRepository = Symbol('ITransactionRepository');
