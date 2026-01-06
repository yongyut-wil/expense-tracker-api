// src/transactions/transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport'; // Guard มาตรฐานของ NestJS

@Controller('transactions')
// ✅ ล็อกทั้ง Controller นี้เลย ถ้าไม่มี Token ห้ามเข้า!
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Request() req, @Body() createTransactionDto: any) {
    const userId = req.user.userId;

    return this.transactionsService.create(userId, createTransactionDto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.transactionsService.findAllByUser(userId);
  }
}
