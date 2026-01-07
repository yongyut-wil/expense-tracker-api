/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
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
}
