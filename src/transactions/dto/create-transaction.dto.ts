/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @ApiProperty({ example: 'ค่าอาหารกลางวัน', description: 'ชื่อรายการ' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 150, description: 'จำนวนเงิน', minimum: 1 })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    description: 'ประเภท: INCOME หรือ EXPENSE',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'อาหาร', description: 'หมวดหมู่' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: '2026-01-15T00:00:00.000Z',
    description: 'วันที่ทำรายการ (optional - ถ้าไม่ระบุจะใช้วันปัจจุบัน)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
