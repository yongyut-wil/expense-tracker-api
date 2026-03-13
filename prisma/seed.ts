// import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@prisma/client/extension';
import { PrismaClient } from '@prisma/client/scripts/default-index.js';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. สร้าง User ทดสอบ
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test Admin User',
    },
  });

  console.log(`✅ Created user: ${testUser.email}`);

  // 2. สร้างรายการ Transaction ตัวอย่าง
  const transactions = [
    {
      title: 'เงินเดือน',
      amount: 50000,
      type: 'INCOME' as const,
      category: 'Salary',
      userId: testUser.id,
    },
    {
      title: 'ค่าเช่าคอนโด',
      amount: 12000,
      type: 'EXPENSE' as const,
      category: 'Rent',
      userId: testUser.id,
    },
    {
      title: 'ค่าอาหารประจำวัน',
      amount: 500,
      type: 'EXPENSE' as const,
      category: 'Food',
      userId: testUser.id,
    },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({
      data: tx,
    });
  }

  console.log('✅ Created sample transactions');
  console.log('🌿 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
