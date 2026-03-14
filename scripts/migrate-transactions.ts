import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const apiKey = process.env.GEMINI_API_KEY;

if (!databaseUrl || !apiKey) {
  console.error('Error: DATABASE_URL or GEMINI_API_KEY is not set in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const prisma = new PrismaClient({ adapter });

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel(
  { model: 'gemini-flash-latest' },
  { apiVersion: 'v1beta' },
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

  const titlesXml = items
    .map((item) => `<item id="${item.id}">${item.title}</item>`)
    .join('\n');

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
      const parsedResults = JSON.parse(jsonString) as Array<{
        id: number;
        category: string;
        titleEn: string;
      }>;

      return parsedResults.map((res) => ({
        ...res,
        category: categories.includes(res.category) ? res.category : 'Other',
      }));
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.status === 429
      ) {
        retries++;
        const wait = 60000;
        console.warn(
          `Rate limit hit (429). Waiting ${wait / 1000}s... (Attempt ${retries}/${maxRetries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, wait));
        continue;
      }
      console.error('Failed to process batch', error);
      return null;
    }
  }
  return null;
}

async function run() {
  console.log('🚀 Starting Data Migration for Transactions...');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { titleEn: null },
        { category: 'Other' },
        { category: 'Food & Dining' }, // Re-scan default ones too
      ],
    },
  });

  console.log(
    `📦 Found ${
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      transactions.length
    } transactions to update.`,
  );

  const batchSize = 10; // ส่งทีละ 10 รายการเพื่อความแม่นยำ
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  for (let i = 0; i < transactions.length; i += batchSize) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const chunk = transactions.slice(i, i + batchSize);
    console.log(
      `\n📦 Processing batch [${Math.floor(i / batchSize) + 1}/${Math.ceil(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        transactions.length / batchSize,
      )}] (${
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        chunk.length
      } items)...`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const results = await processBatch(chunk);

    if (results && Array.isArray(results)) {
      for (const res of results) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await prisma.transaction.update({
          where: { id: Number(res.id) },
          data: {
            titleEn: res.titleEn,
            category: res.category,
          },
        });
        console.log(`  ✅ ID ${res.id}: ${res.category} | ${res.titleEn}`);
      }
    }

    // Delay 5s between batches
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log('✨ Migration completed!');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await prisma.$disconnect();
}

run().catch((e) => console.error(e));
