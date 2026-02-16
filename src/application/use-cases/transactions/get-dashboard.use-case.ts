import { Injectable, Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  DashboardStats,
} from '@domain/repositories/transaction.repository.interface';

/**
 * Get Dashboard Use Case
 * Retrieves dashboard statistics for a user
 */
@Injectable()
export class GetDashboardUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: number): Promise<DashboardStats> {
    return this.transactionRepository.getDashboardStats(userId);
  }
}
