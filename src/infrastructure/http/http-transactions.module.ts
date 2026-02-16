import { Module } from '@nestjs/common';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsModule } from '../transactions/transactions.module';

/**
 * HTTP Transactions Module
 * Provides HTTP endpoints for transactions
 */
@Module({
  imports: [TransactionsModule],
  controllers: [TransactionsController],
})
export class HttpTransactionsModule {}
