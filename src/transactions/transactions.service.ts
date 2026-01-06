import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        title: createTransactionDto.title,
        amount: createTransactionDto.amount,
        type: createTransactionDto.type,
        category: createTransactionDto.category,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId: userId },
      orderBy: { date: 'desc' },
    });
  }

  async getDashboard(userId: number) {
    const summary = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true },
    });

    const totalIncome =
      summary.find((s) => s.type === 'INCOME')?._sum.amount ?? 0;
    const totalExpense =
      summary.find((s) => s.type === 'EXPENSE')?._sum.amount ?? 0;

    const transactionCount = await this.prisma.transaction.count({
      where: { userId },
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount,
    };
  }
}
