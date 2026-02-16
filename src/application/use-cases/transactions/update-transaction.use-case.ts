import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { Transaction } from '@domain/entities/transaction.entity';
import { TransactionNotFoundException } from '@domain/exceptions';

/**
 * Update Transaction Use Case
 * Handles transaction update business logic
 */
@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(data: {
    id: number;
    title?: string;
    amount?: number;
    type?: 'INCOME' | 'EXPENSE';
    category?: string;
    date?: Date;
    userId: number;
  }): Promise<Transaction> {
    // Verify transaction exists and belongs to user
    const existing = await this.transactionRepository.findById(data.id);
    if (!existing) {
      throw new TransactionNotFoundException(data.id);
    }

    if (!existing.belongsTo(data.userId)) {
      throw new TransactionNotFoundException(data.id);
    }

    // Update transaction
    const { id, userId, ...updateData } = data;
    const transaction = await this.transactionRepository.update(id, updateData);

    return transaction;
  }
}
