import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const apiKey = process.env.GEMINI_API_KEY;

if (!databaseUrl || !apiKey) {
  console.error('Error: DATABASE_URL or GEMINI_API_KEY is not set in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel(
  { model: 'gemini-flash-latest' },
  { apiVersion: 'v1beta' }
);

async function processBatch(items: { id: number; title: string }[]) {
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

  const titlesXml = items.map((item, idx) => `<item id="${item.id}">${item.title}</item>`).join('\n');
  
  const prompt = `
    You are a financial assistant. Categorize these transaction titles into ONE of these: [${categories.join(', ')}].
    Also, provide a clean English translation for each.
    
    Titles:
    ${titlesXml}
    
    Respond ONLY with a JSON array in this format:
    [
      {"id": 1, "category": "CategoryName", "titleEn": "English Title"},
      ...
    ]
  `;

  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      const parsedResults = JSON.parse(jsonString);
      
      return parsedResults.map((res: any) => ({
        ...res,
        category: categories.includes(res.category) ? res.category : 'Other'
      }));
    } catch (error: any) {
      if (error?.status === 429) {
        retries++;
        const wait = 60000;
        console.warn(`Rate limit hit (429). Waiting ${wait/1000}s... (Attempt ${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, wait));
        continue;
      }
      console.error(`Failed to process batch`, error);
      return null;
    }
  }
  return null;
}

async function run() {
  console.log('🚀 Starting Data Migration for Transactions...');
  
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { titleEn: null },
        { category: 'Other' },
        { category: 'Food & Dining' } // Re-scan default ones too
      ]
    }
  });

  console.log(`📦 Found ${transactions.length} transactions to update.`);

  const batchSize = 10; // ส่งทีละ 10 รายการเพื่อความแม่นยำ
  for (let i = 0; i < transactions.length; i += batchSize) {
    const chunk = transactions.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch [${Math.floor(i/batchSize) + 1}/${Math.ceil(transactions.length/batchSize)}] (${chunk.length} items)...`);
    
    const results = await processBatch(chunk);
    
    if (results && Array.isArray(results)) {
      for (const res of results) {
        await prisma.transaction.update({
          where: { id: Number(res.id) },
          data: {
            titleEn: res.titleEn,
            category: res.category
          }
        });
        console.log(`  ✅ ID ${res.id}: ${res.category} | ${res.titleEn}`);
      }
    }

    // Delay 5s between batches
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log('✨ Migration completed!');
}

run()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
