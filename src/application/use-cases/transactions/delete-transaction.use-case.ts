import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { TransactionNotFoundException } from '@domain/exceptions';

/**
 * Delete Transaction Use Case
 * Handles transaction deletion with ownership verification
 */
@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(data: { id: number; userId: number }): Promise<void> {
    // Verify transaction exists and belongs to user
    const existing = await this.transactionRepository.findById(data.id);
    if (!existing) {
      throw new TransactionNotFoundException(data.id);
    }

    if (!existing.belongsTo(data.userId)) {
      throw new TransactionNotFoundException(data.id);
    }

    // Delete transaction
    await this.transactionRepository.delete(data.id);
  }
}
