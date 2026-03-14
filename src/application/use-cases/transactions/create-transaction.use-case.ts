import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { Transaction } from '@domain/entities/transaction.entity';
import { KeywordCategorizationService } from '@application/services/keyword-categorization.service';
import { AICategorizationService } from '@application/services/ai-categorization.service';
import dayjs from 'dayjs';

/**
 * Create Transaction Use Case
 * Handles transaction creation business logic
 */
@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    private readonly keywordCategorizationService: KeywordCategorizationService,
    private readonly aiCategorizationService: AICategorizationService,
  ) {}

  async execute(data: {
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date?: Date;
    userId: number;
  }): Promise<Transaction> {
    let finalCategory = data.category;
    let finalTitleEn: string | null = null;
    let finalDate = data.date || new Date();

    // หากส่งวันที่มาแต่เวลาเป็น 0 (มักเป็นจากหน้าบ้านที่เลือกแค่วันที่)
    // ให้พยายามแสตมป์เวลาปัจจุบันเข้าไปเพื่อให้การ Sort แม่นยำ
    if (data.date) {
      const dateObj = dayjs(data.date);
      if (
        dateObj.hour() === 0 &&
        dateObj.minute() === 0 &&
        dateObj.second() === 0
      ) {
        const now = dayjs();
        // ถ้าเป็นวันที่ปัจจุบัน ให้ใช้เวลาปัจจุบัน
        if (dateObj.isSame(now, 'day')) {
          finalDate = now.toDate();
        }
      }
    }

    // If category is not provided or it's a generic one, attempt auto-categorization
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
    if (!finalCategory || genericCategories.includes(finalCategory)) {
      // 1. Try Keyword-based (Fast)
      const keywordCategory = this.keywordCategorizationService.categorize(
        data.title,
      );

      if (keywordCategory) {
        finalCategory = keywordCategory;
        // Even if keyword hits, we should still call AI for titleEn translation
        const aiResult = await this.aiCategorizationService.categorize(
          data.title,
        );
        if (aiResult) {
          finalTitleEn = aiResult.titleEn;
        }
      } else {
        // 2. Try AI-based (Smart)
        const aiResult = await this.aiCategorizationService.categorize(
          data.title,
        );
        if (aiResult) {
          finalCategory = aiResult.category;
          finalTitleEn = aiResult.titleEn;
        }
      }
    } else {
      // If user provided a specific category, we still might want to translate the title
      const aiResult = await this.aiCategorizationService.categorize(
        data.title,
      );
      if (aiResult) {
        finalTitleEn = aiResult.titleEn;
      }
    }

    // Create transaction with determined category and titleEn
    const transaction = await this.transactionRepository.create({
      ...data,
      date: finalDate,
      category: finalCategory || 'Other',
      titleEn: finalTitleEn,
    });

    return transaction;
  }
}
