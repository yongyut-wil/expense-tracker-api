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

  // ดึงเฉพาะของ User คนนั้น (ห้ามดึงของคนอื่น!)
  async findAllByUser(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId: userId },
      orderBy: { date: 'desc' }, // Sort from newest to oldest
    });
  }
}
