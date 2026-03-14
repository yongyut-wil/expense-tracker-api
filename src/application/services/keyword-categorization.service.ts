import { Injectable } from '@nestjs/common';

@Injectable()
export class KeywordCategorizationService {
  private readonly keywordMap: Record<string, string> = {
    // Food & Dining
    ข้าว: 'Food & Dining',
    อาหาร: 'Food & Dining',
    ก๋วยเตี๋ยว: 'Food & Dining',
    shabu: 'Food & Dining',
    kfc: 'Food & Dining',
    mcdonald: 'Food & Dining',
    starbucks: 'Food & Dining',
    cafe: 'Food & Dining',
    coffee: 'Food & Dining',
    กาแฟ: 'Food & Dining',
    lineman: 'Food & Dining',
    grabfood: 'Food & Dining',
    foodpanda: 'Food & Dining',
    เซเว่น: 'Food & Dining',
    '7-11': 'Food & Dining',

    // Transportation
    bts: 'Transportation',
    mrt: 'Transportation',
    grab: 'Transportation',
    bolt: 'Transportation',
    taxi: 'Transportation',
    แท็กซี่: 'Transportation',
    น้ำมัน: 'Transportation',
    เติมน้ำมัน: 'Transportation',

    // Bills & Utilities
    ค่าน้ำ: 'Bills & Utilities',
    ค่าไฟ: 'Bills & Utilities',
    อินเทอร์เน็ต: 'Bills & Utilities',
    internet: 'Bills & Utilities',
    'phone bill': 'Bills & Utilities',
    ค่าโทรศัพท์: 'Bills & Utilities',

    // Shopping
    shopee: 'Shopping',
    lazada: 'Shopping',
    ห้าง: 'Shopping',
    ซื้อของ: 'Shopping',

    // Healthcare
    ยา: 'Healthcare',
    โรงพยาบาล: 'Healthcare',
    หมอ: 'Healthcare',
    hospital: 'Healthcare',
  };

  /**
   * Attempts to categorize based on keywords in the title.
   * Returns category name if matched, null otherwise.
   */
  categorize(title: string): string | null {
    const lowercaseTitle = title.toLowerCase();

    for (const [keyword, category] of Object.entries(this.keywordMap)) {
      if (lowercaseTitle.includes(keyword)) {
        return category;
      }
    }

    return null;
  }
}
