import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository, TransactionRepository } from './repositories';
import { IUserRepository, ITransactionRepository } from '@domain/repositories';

/**
 * Database Module
 * Provides database access and repository implementations
 */
@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
    },
  ],
  exports: [PrismaService, IUserRepository, ITransactionRepository],
})
export class DatabaseModule {}
