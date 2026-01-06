import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/interfaces/jwt-payload.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(user.userId, createTransactionDto);
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.transactionsService.findAllByUser(user.userId);
  }

  @Get('dashboard')
  getDashboard(@CurrentUser() user: RequestUser) {
    return this.transactionsService.getDashboard(user.userId);
  }
}
