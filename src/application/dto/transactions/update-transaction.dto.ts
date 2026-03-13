import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';

/**
 * Update Transaction DTO
 * Uses PartialType to make all fields from CreateTransactionDto optional
 */
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
