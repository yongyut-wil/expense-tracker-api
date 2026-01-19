import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

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
        date: createTransactionDto.date
          ? new Date(createTransactionDto.date)
          : undefined,
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

  async findByDateRange(userId: number, filterDto: FilterTransactionDto) {
    const now = new Date();

    // Default: ต้นเดือนปัจจุบัน
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    // Default: สิ้นเดือนปัจจุบัน
    const defaultEndDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const start = filterDto.startDate
      ? new Date(filterDto.startDate)
      : defaultStartDate;
    const end = filterDto.endDate
      ? new Date(new Date(filterDto.endDate).setHours(23, 59, 59, 999))
      : defaultEndDate;

    return this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getDashboard(userId: number) {
    const now = new Date();

    // เดือนปัจจุบัน
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // เดือนก่อนหน้า
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const previousMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

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

    // คำนวณ % (ป้องกันหารด้วย 0)
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
      // ข้อมูลเดือนปัจจุบัน
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount,

      // ข้อมูลเปรียบเทียบ
      previousMonthIncome: previousIncome,
      previousMonthExpense: previousExpense,
      incomeChange,
      incomeChangePercent: Math.round(incomeChangePercent * 100) / 100, // ปัดเศษ 2 ตำแหน่ง
      expenseChange,
      expenseChangePercent: Math.round(expenseChangePercent * 100) / 100,
    };
  }
}
