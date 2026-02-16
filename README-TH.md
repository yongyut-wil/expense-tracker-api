# 💰 Expense Tracker API

> **ระบบจัดการรายรับ-รายจ่าย** ที่ใช้ Hexagonal Architecture (Clean Architecture)

## 📋 สารบัญ

- [ภาพรวมระบบ](#ภาพรวมระบบ)
- [สถาปัตยกรรม](#สถาปัตยกรรม)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [การติดตั้ง](#การติดตั้ง)
- [การใช้งาน](#การใช้งาน)
- [API Documentation](#api-documentation)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [Path Aliases](#path-aliases)
- [การพัฒนาต่อ](#การพัฒนาต่อ)

---

## 🎯 ภาพรวมระบบ

Expense Tracker API เป็น RESTful API สำหรับจัดการรายรับ-รายจ่ายส่วนบุคคล ออกแบบด้วย **Hexagonal Architecture** (Ports and Adapters) เพื่อให้:

- ✅ แยก Business Logic ออกจาก Technical Detail
- ✅ ทดสอบง่าย ไม่ต้องพึ่ง Database
- ✅ เปลี่ยน Framework/Database ได้ง่าย
- ✅ Code สะอาด อ่านง่าย บำรุงรักษาง่าย

### ฟีเจอร์หลัก

**🔐 Authentication**
- ลงทะเบียนผู้ใช้ใหม่
- เข้าสู่ระบบด้วย JWT
- ดูข้อมูลผู้ใช้ปัจจุบัน

**💸 Transaction Management**
- สร้างรายการรับ-จ่าย
- ดูรายการทั้งหมด
- กรองตามวันที่
- แก้ไข/ลบรายการ (เฉพาะเจ้าของ)
- Dashboard สรุปยอด

---

## 🏗️ สถาปัตยกรรม

### Hexagonal Architecture (Clean Architecture)

```
┌─────────────────────────────────────────────────┐
│         Infrastructure Layer                    │
│    (Controllers, Database, External APIs)       │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │       Application Layer                  │  │
│  │      (Use Cases, Business Logic)         │  │
│  │                                          │  │
│  │   ┌──────────────────────────────────┐  │  │
│  │   │      Domain Layer                │  │  │
│  │   │   (Entities, Value Objects)      │  │  │
│  │   └──────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**หลักการ Dependency Rule**:
> Infrastructure → Application → Domain

**Domain Layer ไม่มีการพึ่งพา Layer อื่น!**

### 3 Layers อธิบาย

#### 1️⃣ Domain Layer (Core Business)
**ไฟล์**: `src/domain/`

- **Entities**: User, Transaction (ข้อมูลหลัก + Business Rules)
- **Value Objects**: Email, Money, TransactionType (ค่าที่ไม่เปลี่ยนแปลง)
- **Repository Interfaces**: IUserRepository, ITransactionRepository (สัญญา)
- **Domain Exceptions**: กำหนด Error ที่เกิดขึ้นได้

**ไม่มี**: Database, HTTP, Framework

#### 2️⃣ Application Layer (Use Cases)
**ไฟล์**: `src/application/`

- **Use Cases**: RegisterUser, Login, CreateTransaction, etc.
- **DTOs**: ข้อมูลรับ-ส่ง (Input/Output)

**หน้าที่**: ประสานงานระหว่าง Domain และ Infrastructure

#### 3️⃣ Infrastructure Layer (Technical Details)
**ไฟล์**: `src/infrastructure/`

- **Database**: Prisma, Repository implementations
- **HTTP**: Controllers, Decorators, Filters, Interceptors
- **Auth**: JWT Strategy
- **Mappers**: แปลงข้อมูลระหว่าง Domain ↔ Database

**หน้าที่**: เชื่อมต่อกับ Database, HTTP, External Services

---

## 🛠️ เทคโนโลยีที่ใช้

| หมวด | เทคโนโลยี |
|------|-----------|
| **Framework** | NestJS 10.x |
| **Language** | TypeScript 5.x |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | JWT + Passport |
| **Validation** | class-validator |
| **Password** | bcrypt |
| **API Docs** | Swagger/OpenAPI |
| **Package Manager** | Yarn |

---

## ⚙️ การติดตั้ง

### ความต้องการ

- Node.js >= 18.x
- PostgreSQL >= 14.x
- Yarn
- Docker (optional)

### ขั้นตอน

1. **Clone โปรเจค**
   ```bash
   git clone <repository-url>
   cd expense-tracker-api
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   yarn install
   ```

3. **ตั้งค่า Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   แก้ไขไฟล์ `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/expense_tracker"
   JWT_SECRET="your-super-secret-key"
   JWT_EXPIRES_IN="24h"
   ```

4. **เริ่ม Database (ใช้ Docker)**
   ```bash
   docker compose up -d
   ```

5. **Run Migration**
   ```bash
   yarn prisma migrate deploy
   yarn prisma generate
   ```

6. **เริ่มระบบ**
   ```bash
   # Development
   yarn start:dev
   
   # Production
   yarn build
   yarn start:prod
   ```

7. **เปิด Swagger UI**
   ```
   http://localhost:3000/api
   ```

---

## 🚀 การใช้งาน

### API Endpoints

#### Authentication

```bash
# ลงทะเบียน
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

# Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
# Response: { "access_token": "...", "user": {...} }

# ดูข้อมูลตัวเอง (ต้อง login)
GET /auth/me
Authorization: Bearer <token>
```

#### Transactions

```bash
# สร้างรายการใหม่
POST /transactions
Authorization: Bearer <token>
{
  "title": "ค่าอาหารกลางวัน",
  "amount": 150,
  "type": "EXPENSE",
  "category": "อาหาร",
  "date": "2026-02-16T04:00:00.000Z"
}

# ดูรายการทั้งหมด
GET /transactions
Authorization: Bearer <token>

# กรองตามวันที่
GET /transactions/filter?startDate=2026-02-01&endDate=2026-02-28
Authorization: Bearer <token>

# Dashboard
GET /transactions/dashboard
Authorization: Bearer <token>

# แก้ไข
PUT /transactions/{id}
Authorization: Bearer <token>

# ลบ
DELETE /transactions/{id}
Authorization: Bearer <token>
```

---

## 📁 โครงสร้างโปรเจค

```
expense-tracker-api/
├── prisma/
│   └── schema.prisma          # Database Schema
├── src/
│   ├── domain/                # 🔵 Domain Layer
│   │   ├── entities/          # User, Transaction
│   │   ├── value-objects/     # Email, Money, TransactionType
│   │   ├── repositories/      # Interface (Ports)
│   │   └── exceptions/        # Domain Errors
│   │
│   ├── application/           # 🟢 Application Layer
│   │   ├── use-cases/         # Business Logic
│   │   │   ├── auth/          # Register, Login, GetCurrentUser
│   │   │   └── transactions/  # CRUD + Dashboard
│   │   └── dto/               # Data Transfer Objects
│   │
│   ├── infrastructure/        # 🟡 Infrastructure Layer
│   │   ├── database/
│   │   │   ├── repositories/  # Implementations (Adapters)
│   │   │   └── mappers/       # Domain ↔ Prisma
│   │   ├── prisma/
│   │   ├── auth/              # JWT Strategy
│   │   ├── transactions/
│   │   └── http/
│   │       ├── controllers/   # REST API
│   │       ├── decorators/    # @CurrentUser
│   │       ├── filters/       # Error Handling
│   │       └── interceptors/  # Response Transform
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/                      # E2E Tests
├── .env.example
├── docker-compose.yml
├── tsconfig.json              # Path Aliases
└── package.json
```

---

## 🎯 Path Aliases

ใช้ **TypeScript Path Aliases** เพื่อ import ที่สะอาดขึ้น:

### ตั้งค่าใน `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@domain/*": ["src/domain/*"],
      "@application/*": ["src/application/*"],
      "@infrastructure/*": ["src/infrastructure/*"]
    }
  }
}
```

### ตัวอย่างการใช้

```typescript
// ❌ ก่อน (Relative Paths)
import { User } from '../../../domain/entities/user.entity';
import { RegisterUserUseCase } from '../../../application/use-cases/auth';

// ✅ หลัง (Path Aliases)
import { User } from '@domain/entities/user.entity';
import { RegisterUserUseCase } from '@application/use-cases/auth';
```

**ดูเพิ่มเติม**: [Path Aliases Guide](./docs/path-aliases-guide.md)

---

## 👨‍💻 การพัฒนาต่อ

### เพิ่ม Feature ใหม่ (Best Practice)

**ตัวอย่าง**: เพิ่มฟีเจอร์ "Budget Management"

#### 1. เริ่มที่ Domain Layer

```typescript
// src/domain/entities/budget.entity.ts
export class Budget {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly category: string,
    public readonly limit: Money,
    public readonly period: 'MONTHLY' | 'YEARLY',
  ) {}
  
  isExceeded(spent: Money): boolean {
    return spent.greaterThan(this.limit);
  }
}
```

#### 2. สร้าง Repository Interface (Port)

```typescript
// src/domain/repositories/budget.repository.interface.ts
export interface IBudgetRepository {
  findByUserId(userId: number): Promise<Budget[]>;
  save(budget: Budget): Promise<Budget>;
}

export const IBudgetRepository = Symbol('IBudgetRepository');
```

#### 3. สร้าง Use Case

```typescript
// src/application/use-cases/budgets/create-budget.use-case.ts
@Injectable()
export class CreateBudgetUseCase {
  constructor(
    @Inject(IBudgetRepository)
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  async execute(data: CreateBudgetDto): Promise<Budget> {
    // Business logic here
    return this.budgetRepository.save(budget);
  }
}
```

#### 4. สร้าง Repository Implementation (Adapter)

```typescript
// src/infrastructure/database/repositories/budget.repository.ts
@Injectable()
export class BudgetRepository implements IBudgetRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<Budget[]> {
    const budgets = await this.prisma.budget.findMany({ 
      where: { userId } 
    });
    return budgets.map(BudgetMapper.toDomain);
  }
  
  async save(budget: Budget): Promise<Budget> {
    // Implementation
  }
}
```

#### 5. สร้าง Controller

```typescript
// src/infrastructure/http/controllers/budgets.controller.ts
@Controller('budgets')
@UseGuards(AuthGuard('jwt'))
export class BudgetsController {
  constructor(
    private readonly createBudgetUseCase: CreateBudgetUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateBudgetDto) {
    const budget = await this.createBudgetUseCase.execute(dto);
    return { success: true, data: budget };
  }
}
```

#### 6. ลงทะเบียนใน Module

```typescript
// src/infrastructure/budgets/budgets.module.ts
@Module({
  imports: [DatabaseModule],
  providers: [CreateBudgetUseCase],
  exports: [CreateBudgetUseCase],
})
export class BudgetsModule {}
```

### คำสั่งที่ใช้บ่อย

```bash
# Development
yarn start:dev          # Run with hot-reload

# Build
yarn build             # Compile TypeScript

# Testing
yarn test              # Unit tests
yarn test:e2e          # E2E tests
yarn test:cov          # Coverage

# Database
yarn prisma studio     # GUI for database
yarn prisma migrate dev # Create migration
yarn prisma generate   # Generate Prisma Client

# Linting
yarn lint              # Check code style
yarn format            # Auto-format code
```

---

## 📚 เอกสารเพิ่มเติม

- [Architecture Guide](./docs/architecture-guide-th.md) - อธิบาย Hexagonal Architecture แบบละเอียด
- [Path Aliases Guide](./docs/path-aliases-guide.md) - วิธีใช้ Path Aliases
- [API Documentation](http://localhost:3000/api) - Swagger UI (ต้อง run server ก่อน)

---

## 🧪 Testing

```bash
# Unit Tests
yarn test

# E2E Tests  
yarn test:e2e

# Test Coverage
yarn test:cov
```

### ตัวอย่าง Unit Test

```typescript
describe('RegisterUserUseCase', () => {
  it('should register new user successfully', async () => {
    const mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockImplementation(user => Promise.resolve(user)),
    };

    const useCase = new RegisterUserUseCase(mockUserRepo, jwtService);
    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });

    expect(result.user.email.value).toBe('test@example.com');
  });
});
```

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# ตรวจสอบว่า PostgreSQL ทำงานอยู่
docker compose ps

# ดู logs
docker compose logs postgres

# Restart
docker compose restart postgres
```

### Port Already in Use

```bash
# เปลี่ยน port ในไฟล์ main.ts หรือใช้
PORT=3001 yarn start:dev
```

### Prisma Client ล้าสมัย

```bash
yarn prisma generate
```

---

## 📄 License

MIT

---

## 👥 Contributing

1. Fork โปรเจค
2. สร้าง feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. เปิด Pull Request

---

## 📞 Contact

- Email: your-email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

**สร้างด้วย ❤️ โดยใช้ Hexagonal Architecture**
