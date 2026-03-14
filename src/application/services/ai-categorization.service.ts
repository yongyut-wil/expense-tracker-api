import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AICategorizationService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // จากการตรวจสอบ ListModels พบว่า 'gemini-flash-latest' พร้อมใช้งานใน v1beta
      // ซึ่งมักจะเป็นเวอร์ชัน 1.5 Flash ที่เสถียรที่สุดสำหรับ Free Tier
      this.model = this.genAI.getGenerativeModel(
        { model: 'gemini-flash-latest' },
        { apiVersion: 'v1beta' },
      );
    }
  }

  /**
   * Uses Gemini AI to categorize the transaction title and provide an English translation.
   */
  async categorize(
    title: string,
  ): Promise<{ category: string; titleEn: string } | null> {
    if (!this.model) {
      console.warn('AICategorizationService: GEMINI_API_KEY not configured.');
      return null;
    }

    const categories = [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Salary',
      'Freelance',
      'Investment',
      'Gift',
      'Other',
    ];

    const prompt = `
      You are a financial assistant. Categorize this transaction title into ONE of these categories: 
      [${categories.join(', ')}].
      
      Also, provide a clean, standardized English translation or normalization of the title.
      - If the title is in Thai, translate it to English.
      - If the title is already in English, normalize it (e.g., "taxi fareee" -> "Taxi fare").
      
      Respond ONLY with a JSON object in this format:
      {
        "category": "CategoryName",
        "titleEn": "English Title"
      }
      
      Title: "${title}"
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text().trim();

      // Attempt to parse JSON from response
      // Sometimes AI might wrap it in markdown code blocks
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;

      const parsed = JSON.parse(jsonString);

      const category = parsed.category;
      const titleEn = parsed.titleEn;

      return {
        category: categories.includes(category) ? category : 'Other',
        titleEn: titleEn || title, // Fallback to original title if translation fails
      };
    } catch (error) {
      console.error('AICategorizationService Error:', error);
      return null;
    }
  }
}
