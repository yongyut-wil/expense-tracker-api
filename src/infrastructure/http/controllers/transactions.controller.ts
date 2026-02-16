import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateTransactionUseCase,
  GetTransactionsUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
  GetDashboardUseCase,
} from '@application/use-cases/transactions';
import { CreateTransactionDto } from '@application/dto/transactions/create-transaction.dto';
import { FilterTransactionDto } from '@application/dto/transactions/filter-transaction.dto';
import { CurrentUser } from '@infrastructure/http/decorators/current-user.decorator';

/**
 * Transactions Controller
 * Handles transaction-related HTTP requests
 */
@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
    private readonly getDashboardUseCase: GetDashboardUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'สร้างรายการธุรกรรมใหม่' })
  async create(
    @CurrentUser() user: { userId: number },
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const transaction = await this.createTransactionUseCase.execute({
      ...createTransactionDto,
      date: createTransactionDto.date
        ? new Date(createTransactionDto.date)
        : undefined,
      userId: user.userId,
    });

    return {
      success: true,
      data: transaction.toPlainObject(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'ดูรายการธุรกรรมทั้งหมด' })
  async findAll(@CurrentUser() user: { userId: number }) {
    const transactions = await this.getTransactionsUseCase.execute({
      userId: user.userId,
    });

    return {
      success: true,
      data: transactions.map((t) => t.toPlainObject()),
    };
  }

  @Get('filter')
  @ApiOperation({ summary: 'กรองรายการธุรกรรมตามวันที่' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-01-31' })
  async findByDateRange(
    @CurrentUser() user: { userId: number },
    @Query() filterDto: FilterTransactionDto,
  ) {
    const transactions = await this.getTransactionsUseCase.execute({
      userId: user.userId,
      startDate: filterDto.startDate
        ? new Date(filterDto.startDate)
        : undefined,
      endDate: filterDto.endDate ? new Date(filterDto.endDate) : undefined,
    });

    return {
      success: true,
      data: transactions.map((t) => t.toPlainObject()),
    };
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'ดูสถิติแดชบอร์ด' })
  async getDashboard(@CurrentUser() user: { userId: number }) {
    const stats = await this.getDashboardUseCase.execute(user.userId);

    return {
      success: true,
      data: stats,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'แก้ไขรายการธุรกรรม' })
  async update(
    @CurrentUser() user: { userId: number },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: Partial<CreateTransactionDto>,
  ) {
    const transaction = await this.updateTransactionUseCase.execute({
      id,
      userId: user.userId,
      ...updateTransactionDto,
      date: updateTransactionDto.date
        ? new Date(updateTransactionDto.date)
        : undefined,
    });

    return {
      success: true,
      data: transaction.toPlainObject(),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบรายการธุรกรรม' })
  async delete(
    @CurrentUser() user: { userId: number },
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.deleteTransactionUseCase.execute({
      id,
      userId: user.userId,
    });

    return {
      success: true,
      message: 'Transaction deleted successfully',
    };
  }
}
