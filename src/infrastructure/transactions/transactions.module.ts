import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';

// Import use cases
import {
  CreateTransactionUseCase,
  GetTransactionsUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
  GetDashboardUseCase,
} from '@application/use-cases/transactions';

// Import services
import { KeywordCategorizationService } from '@application/services/keyword-categorization.service';
import { AICategorizationService } from '@application/services/ai-categorization.service';

/**
 * Transactions Module
 * Handles transaction-related functionality
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    // Use Cases
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    GetDashboardUseCase,
    // Services
    KeywordCategorizationService,
    AICategorizationService,
  ],
  exports: [
    // Export use cases for controllers
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    GetDashboardUseCase,
  ],
})
export class TransactionsModule {}
