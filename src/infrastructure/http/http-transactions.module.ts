import { Module } from '@nestjs/common';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TransactionsModule, AuthModule],
  controllers: [TransactionsController],
})
export class HttpTransactionsModule {}
