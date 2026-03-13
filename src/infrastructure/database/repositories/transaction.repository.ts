import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ITransactionRepository,
  DashboardStats,
} from '@domain/repositories/transaction.repository.interface';
import { Transaction } from '@domain/entities/transaction.entity';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { TransactionNotFoundException } from '@domain/exceptions';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Transaction Repository Implementation
 * Implements the ITransactionRepository interface using Prisma
 */
@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async findByUserId(userId: number): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return TransactionMapper.toDomainList(transactions);
  }

  async findByDateRange(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
    return TransactionMapper.toDomainList(transactions);
  }

  async create(data: {
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date?: Date;
    userId: number;
  }): Promise<Transaction> {
    const transaction = await this.prisma.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date ?? new Date(),
        userId: data.userId,
      },
    });
    return TransactionMapper.toDomain(transaction);
  }

  async update(
    id: number,
    data: Partial<{
      title: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      category: string;
      date: Date;
    }>,
  ): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.update({
        where: { id },
        data,
      });
      return TransactionMapper.toDomain(transaction);
    } catch {
      throw new TransactionNotFoundException(id);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.transaction.delete({ where: { id } });
    } catch {
      throw new TransactionNotFoundException(id);
    }
  }

  async getDashboardStats(userId: number): Promise<DashboardStats> {
    // For Bangkok (UTC+7), determine the "current" year and month from the user's perspective.
    // However, since frontend now normalizes all day midnights to 00:00 UTC,
    // our boundaries should be clean UTC midnights.
    const nowUTC = dayjs.utc();
    const bangkokNow = nowUTC.add(7, 'hour'); // Anchor "today" in Bangkok

    const currentMonthStart = bangkokNow.startOf('month').utc(true).toDate();
    const currentMonthEnd = bangkokNow.endOf('month').utc(true).toDate();

    const previousMonthStart = bangkokNow
      .subtract(1, 'month')
      .startOf('month')
      .utc(true)
      .toDate();
    const previousMonthEnd = bangkokNow
      .subtract(1, 'month')
      .endOf('month')
      .utc(true)
      .toDate();

    // ข้อมูลเดือนปัจจุบัน
    const currentSummary = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _sum: { amount: true },
    });

    // ข้อมูลเดือนก่อนหน้า
    const previousSummary = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        date: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      _sum: { amount: true },
    });

    const totalIncome =
      currentSummary.find((s) => s.type === 'INCOME')?._sum.amount ?? 0;
    const totalExpense =
      currentSummary.find((s) => s.type === 'EXPENSE')?._sum.amount ?? 0;

    const previousIncome =
      previousSummary.find((s) => s.type === 'INCOME')?._sum.amount ?? 0;
    const previousExpense =
      previousSummary.find((s) => s.type === 'EXPENSE')?._sum.amount ?? 0;

    const incomeChange = totalIncome - previousIncome;
    const expenseChange = totalExpense - previousExpense;

    const incomeChangePercent =
      previousIncome > 0 ? (incomeChange / previousIncome) * 100 : 0;
    const expenseChangePercent =
      previousExpense > 0 ? (expenseChange / previousExpense) * 100 : 0;

    const transactionCount = await this.prisma.transaction.count({
      where: {
        userId,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount,
      previousMonthIncome: previousIncome,
      previousMonthExpense: previousExpense,
      incomeChange,
      incomeChangePercent: Math.round(incomeChangePercent * 100) / 100,
      expenseChange,
      expenseChangePercent: Math.round(expenseChangePercent * 100) / 100,
    };
  }

  async count(
    userId: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    return this.prisma.transaction.count({
      where: {
        userId,
        ...(startDate &&
          endDate && {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
    });
  }
}
