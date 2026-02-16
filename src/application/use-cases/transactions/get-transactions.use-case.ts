import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { Transaction } from '@domain/entities/transaction.entity';

/**
 * Get Transactions Use Case
 * Retrieves transactions with optional date filtering
 */
@Injectable()
export class GetTransactionsUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(data: {
    userId: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Transaction[]> {
    // If date range provided, filter by date
    if (data.startDate && data.endDate) {
      return this.transactionRepository.findByDateRange(
        data.userId,
        data.startDate,
        data.endDate,
      );
    }

    // Otherwise return all transactions
    return this.transactionRepository.findByUserId(data.userId);
  }
}
