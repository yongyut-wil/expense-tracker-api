import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/interfaces/jwt-payload.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
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

  @Get('filter')
  @ApiQuery({ name: 'startDate', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-01-31' })
  findByDateRange(
    @CurrentUser() user: RequestUser,
    @Query() filterDto: FilterTransactionDto,
  ) {
    return this.transactionsService.findByDateRange(user.userId, filterDto);
  }

  @Get('dashboard')
  getDashboard(@CurrentUser() user: RequestUser) {
    return this.transactionsService.getDashboard(user.userId);
  }
}

