import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { Transaction } from '@domain/entities/transaction.entity';
import { TransactionNotFoundException } from '@domain/exceptions';
import { KeywordCategorizationService } from '@application/services/keyword-categorization.service';
import { AICategorizationService } from '@application/services/ai-categorization.service';
import dayjs from 'dayjs';

/**
 * Update Transaction Use Case
 * Handles transaction update business logic
 */
@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    private readonly keywordCategorizationService: KeywordCategorizationService,
    private readonly aiCategorizationService: AICategorizationService,
  ) {}

  async execute(data: {
    id: number;
    title?: string;
    amount?: number;
    type?: 'INCOME' | 'EXPENSE';
    category?: string;
    date?: Date;
    userId: number;
  }): Promise<Transaction> {
    // Verify transaction exists and belongs to user
    const existing = await this.transactionRepository.findById(data.id);
    if (!existing) {
      throw new TransactionNotFoundException(data.id);
    }

    if (!existing.belongsTo(data.userId)) {
      throw new TransactionNotFoundException(data.id);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, userId, ...dataWithoutIds } = data;
    const updateData: Partial<{
      title?: string;
      amount?: number;
      type?: 'INCOME' | 'EXPENSE';
      category?: string;
      date?: Date;
      titleEn?: string;
    }> = dataWithoutIds;

    // จัดการเรื่องเวลาในการอัปเดต
    if (data.date) {
      const dateObj = dayjs(data.date);
      // ถ้าแก้แค่วันที่แต่เวลามาเป็น 0 และเป็นวันนี้ ให้ใช้เวลา Now
      if (
        dateObj.hour() === 0 &&
        dateObj.minute() === 0 &&
        dateObj.second() === 0
      ) {
        const now = dayjs();
        if (dateObj.isSame(now, 'day')) {
          updateData.date = now.toDate();
        }
      }
    }

    const genericCategories = [
      'Other',
      'รายจ่ายอื่นๆ',
      'Food & Dining',
      'Food',
      'Transportation',
      'Transport',
      'Bills & Utilities',
      'Utilities',
      'อาหารและเครื่องดื่ม',
      'อื่นๆ',
    ];

    const titleToScan = data.title || existing.title;
    const titleChanged = data.title && data.title !== existing.title;
    const categoryIsGeneric =
      !data.category || genericCategories.includes(data.category);

    // Re-categorize if title changed OR if the user is using a generic category
    if (titleToScan && (titleChanged || categoryIsGeneric)) {
      // 1. Re-translate & Get AI opinion
      const aiResult =
        await this.aiCategorizationService.categorize(titleToScan);

      if (aiResult) {
        updateData.titleEn = aiResult.titleEn;

        // Only overwrite category if generic
        if (categoryIsGeneric) {
          updateData.category = aiResult.category;
        }
      } else {
        // Fallback to keyword if AI fails
        const keywordCategory =
          this.keywordCategorizationService.categorize(titleToScan);
        if (keywordCategory && categoryIsGeneric) {
          updateData.category = keywordCategory;
        }
      }
    }

    const transaction = await this.transactionRepository.update(
      data.id,
      updateData,
    );

    return transaction;
  }
}
