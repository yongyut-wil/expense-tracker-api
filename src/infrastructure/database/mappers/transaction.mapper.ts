import {
  Transaction as PrismaTransaction,
  TransactionType as PrismaTransactionType,
} from '@prisma/client';
import { Transaction } from '@domain/entities/transaction.entity';

/**
 * Mapper for converting between Prisma Transaction model and Domain Transaction entity
 */
export class TransactionMapper {
  /**
   * Converts Prisma Transaction to Domain Transaction entity
   */
  static toDomain(prismaTransaction: PrismaTransaction): Transaction {
    return Transaction.create({
      id: prismaTransaction.id,
      title: prismaTransaction.title,
      amount: prismaTransaction.amount,
      type: prismaTransaction.type as 'INCOME' | 'EXPENSE',
      category: prismaTransaction.category,
      date: prismaTransaction.date,
      userId: prismaTransaction.userId,
    });
  }

  /**
   * Converts Domain Transaction entity to Prisma Transaction model data
   */
  static toPrisma(transaction: Transaction): Omit<PrismaTransaction, 'id'> {
    return {
      title: transaction.title,
      amount: transaction.amount.amount,
      type: transaction.type.value as PrismaTransactionType,
      category: transaction.category,
      date: transaction.date,
      userId: transaction.userId,
    };
  }

  /**
   * Converts array of Prisma Transactions to Domain Transactions
   */
  static toDomainList(prismaTransactions: PrismaTransaction[]): Transaction[] {
    return prismaTransactions.map((transaction) => this.toDomain(transaction));
  }
}
