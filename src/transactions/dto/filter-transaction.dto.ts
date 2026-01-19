/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterTransactionDto {
  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'วันที่เริ่มต้น (รูปแบบ: YYYY-MM-DD หรือ ISO8601)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-01-31',
    description: 'วันที่สิ้นสุด (รูปแบบ: YYYY-MM-DD หรือ ISO8601)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
