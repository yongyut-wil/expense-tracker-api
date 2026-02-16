import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { Transaction } from '@domain/entities/transaction.entity';

/**
 * Create Transaction Use Case
 * Handles transaction creation business logic
 */
@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(data: {
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date?: Date;
    userId: number;
  }): Promise<Transaction> {
    // Create transaction
    const transaction = await this.transactionRepository.create(data);

    return transaction;
  }
}
