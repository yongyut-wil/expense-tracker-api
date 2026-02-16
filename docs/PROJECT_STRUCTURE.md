# 📁 โครงสร้างโปรเจค Expense Tracker API

## สารบัญ

- [ภาพรวม](#ภาพรวม)
- [โครงสร้างไดเรกทอรี](#โครงสร้างไดเรกทอรี)
- [รายละเอียดโมดูล](#รายละเอียดโมดูล)
- [ไฟล์คอนฟิก](#ไฟล์คอนฟิก)
- [File Naming Conventions](#file-naming-conventions)
- [Module Dependencies](#module-dependencies)

---

## ภาพรวม

โปรเจค **Expense Tracker API** เป็น RESTful API ที่พัฒนาด้วย **NestJS Framework** โดยมีโครงสร้างแบบ **Modular** ที่แยกความรับผิดชอบของแต่ละส่วนอย่างชัดเจน ตามหลักการของ **Hexagonal Architecture**

---

## โครงสร้างไดเรกทอรี

### 📂 โครงสร้างโฟลเดอร์แบบเต็ม

```
expense-tracker-api/
├── 📂 src/                          # ซอร์สโค้ดหลัก
│   ├── 📂 auth/                     # โมดูล Authentication
│   │   ├── 📂 decorators/           # Custom Decorators
│   │   │   └── public.decorator.ts
│   │   ├── 📂 dto/                  # Data Transfer Objects
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── index.ts
│   │   ├── 📂 interfaces/           # TypeScript Interfaces
│   │   │   ├── auth-response.interface.ts
│   │   │   └── jwt-payload.interface.ts
│   │   ├── 📂 strategies/           # Passport Strategies
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts       # HTTP Endpoints
│   │   ├── auth.controller.spec.ts  # Unit Tests
│   │   ├── auth.service.ts          # Business Logic
│   │   ├── auth.service.spec.ts     # Unit Tests
│   │   └── auth.module.ts           # Module Definition
│   │
│   ├── 📂 users/                    # โมดูล Users
│   │   ├── 📂 dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── 📂 entities/
│   │   │   └── user.entity.ts       # Domain Entity
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── 📂 transactions/             # โมดูล Transactions
│   │   ├── 📂 dto/
│   │   │   ├── create-transaction.dto.ts
│   │   │   └── filter-transaction.dto.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.module.ts
│   │
│   ├── 📂 prisma/                   # โมดูล Prisma (Database)
│   │   ├── prisma.service.ts        # Database Service
│   │   └── prisma.module.ts
│   │
│   ├── 📂 common/                   # Shared Resources
│   │   ├── 📂 filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── 📂 interceptors/
│   │   │   └── response.interceptor.ts
│   │   └── 📂 interfaces/
│   │       └── response.interface.ts
│   │
│   ├── app.controller.ts            # Root Controller
│   ├── app.controller.spec.ts
│   ├── app.service.ts               # Root Service
│   ├── app.module.ts                # Root Module
│   └── main.ts                      # Entry Point
│
├── 📂 prisma/                       # Prisma Schema & Migrations
│   ├── 📂 migrations/               # Database Migrations
│   │   ├── 📂 20260212104303_migrat_db/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma                # Database Schema
│
├── 📂 test/                         # E2E Tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── 📂 docs/                         # เอกสารประกอบ
│   ├── HEXAGONAL_ARCHITECTURE.md
│   ├── PROJECT_STRUCTURE.md
│   ├── COMMANDS.md
│   ├── API_GUIDE.md
│   ├── DATABASE_SCHEMA.md
│   └── DEVELOPMENT_GUIDE.md
│
├── 📂 dist/                         # ไฟล์ที่ compile แล้ว (Production)
├── 📂 node_modules/                 # Dependencies
│
├── 📄 .env                          # Environment Variables (Git ignored)
├── 📄 .env.example                  # ตัวอย่าง Environment Variables
├── 📄 .gitignore                    # Git Ignore Rules
├── 📄 .nvmrc                        # Node Version
├── 📄 .prettierrc                   # Prettier Config
├── 📄 docker-compose.yml            # Docker Compose Config
├── 📄 eslint.config.mjs             # ESLint Config
├── 📄 nest-cli.json                 # NestJS CLI Config
├── 📄 package.json                  # NPM Dependencies & Scripts
├── 📄 prisma.config.ts              # Prisma Config
├── 📄 README.md                     # เอกสารหลัก
├── 📄 tsconfig.json                 # TypeScript Config
├── 📄 tsconfig.build.json           # TypeScript Build Config
└── 📄 yarn.lock                     # Yarn Lock File
```

---

## รายละเอียดโมดูล

### 🔐 1. Auth Module (`src/auth/`)

**ความรับผิดชอบ**: จัดการระบบ Authentication และ Authorization

#### โครงสร้าง

```
auth/
├── decorators/           # Custom Decorators สำหรับ Auth
├── dto/                  # Data Transfer Objects
├── interfaces/           # TypeScript Interfaces
├── strategies/           # Passport Strategies
├── auth.controller.ts    # API Endpoints
├── auth.service.ts       # Business Logic
└── auth.module.ts        # Module Configuration
```

#### ไฟล์สำคัญ

| ไฟล์ | คำอธิบาย |
|------|----------|
| [auth.controller.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/auth/auth.controller.ts) | HTTP Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/me` |
| [auth.service.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/auth/auth.service.ts) | Logic: ตรวจสอบ credentials, สร้าง JWT token, hash password |
| [jwt.strategy.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/auth/strategies/jwt.strategy.ts) | Passport JWT Strategy สำหรับตรวจสอบ Token |
| [public.decorator.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/auth/decorators/public.decorator.ts) | Decorator สำหรับ endpoints ที่ไม่ต้อง authentication |

#### DTOs

```typescript
// login.dto.ts - ข้อมูลสำหรับเข้าสู่ระบบ
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// register.dto.ts - ข้อมูลสำหรับลงทะเบียน
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
```

#### Interfaces

```typescript
// jwt-payload.interface.ts
export interface JwtPayload {
  sub: number;      // User ID
  email: string;    // User Email
}

// auth-response.interface.ts
export interface AuthResponse {
  access_token: string;
}
```

---

### 👤 2. Users Module (`src/users/`)

**ความรับผิดชอบ**: จัดการข้อมูลผู้ใช้

#### โครงสร้าง

```
users/
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── entities/
│   └── user.entity.ts      # Domain Entity
├── users.controller.ts
├── users.service.ts
└── users.module.ts
```

#### ไฟล์สำคัญ

| ไฟล์ | คำอธิบาย |
|------|----------|
| [users.controller.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/users/users.controller.ts) | CRUD Endpoints สำหรับจัดการผู้ใช้ |
| [users.service.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/users/users.service.ts) | Business Logic: create, findAll, findOne, update, remove, findByEmail |
| [user.entity.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/users/entities/user.entity.ts) | Domain Model สำหรับ User |

#### API Endpoints

- `GET /api/users` - ดูรายการผู้ใช้ทั้งหมด
- `GET /api/users/:id` - ดูข้อมูลผู้ใช้ตาม ID
- `PATCH /api/users/:id` - แก้ไขข้อมูลผู้ใช้
- `DELETE /api/users/:id` - ลบผู้ใช้

---

### 💰 3. Transactions Module (`src/transactions/`)

**ความรับผิดชอบ**: จัดการรายการรายรับ-รายจ่าย

#### โครงสร้าง

```
transactions/
├── dto/
│   ├── create-transaction.dto.ts
│   └── filter-transaction.dto.ts
├── transactions.controller.ts
├── transactions.service.ts
└── transactions.module.ts
```

#### ไฟล์สำคัญ

| ไฟล์ | คำอธิบาย |
|------|----------|
| [transactions.controller.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/transactions/transactions.controller.ts) | API Endpoints สำหรับจัดการธุรกรรม |
| [transactions.service.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/transactions/transactions.service.ts) | Business Logic: create, findAll, filter by date, dashboard summary |

#### Features

- ✅ สร้างรายการธุรกรรม (รายรับ/รายจ่าย)
- ✅ ดูรายการธุรกรรมทั้งหมดของผู้ใช้
- ✅ กรองตามช่วงวันที่
- ✅ Dashboard สรุปรายรับ-รายจ่ายรายเดือน
- ✅ เปรียบเทียบกับเดือนก่อนหน้า

#### DTOs

```typescript
// create-transaction.dto.ts
export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;  // INCOME | EXPENSE

  @IsString()
  category: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}

// filter-transaction.dto.ts
export class FilterTransactionDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
```

#### API Endpoints

- `GET /api/transactions` - ดูรายการธุรกรรมทั้งหมด
- `GET /api/transactions/dashboard` - ดูสรุปรายเดือน
- `GET /api/transactions/filter` - กรองตามช่วงวันที่
- `POST /api/transactions` - สร้างรายการใหม่
- `GET /api/transactions/:id` - ดูรายการตาม ID
- `PATCH /api/transactions/:id` - แก้ไขรายการ
- `DELETE /api/transactions/:id` - ลบรายการ

---

### 🗄️ 4. Prisma Module (`src/prisma/`)

**ความรับผิดชอบ**: จัดการการเชื่อมต่อกับ Database

#### โครงสร้าง

```
prisma/
├── prisma.service.ts    # Database Connection Service
└── prisma.module.ts     # Global Module
```

#### ไฟล์สำคัญ

| ไฟล์ | คำอธิบาย |
|------|----------|
| [prisma.service.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/prisma/prisma.service.ts) | Service สำหรับเชื่อมต่อ PostgreSQL ผ่าน Prisma ORM |
| [prisma.module.ts](file:///Users/yongyut/Project/Personal/expense-tracker-api/src/prisma/prisma.module.ts) | Global Module ที่ export PrismaService ให้ modules อื่นใช้ |

```typescript
// prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();  // เชื่อมต่อเมื่อ app เริ่มต้น
  }

  async onModuleDestroy() {
    await this.$disconnect();  // ตัดการเชื่อมต่อเมื่อ app ปิด
  }
}
```

---

### 🛠️ 5. Common Module (`src/common/`)

**ความรับผิดชอบ**: Shared utilities, filters, interceptors

#### โครงสร้าง

```
common/
├── filters/
│   └── http-exception.filter.ts      # Global Exception Handler
├── interceptors/
│   └── response.interceptor.ts       # Response Transformer
└── interfaces/
    └── response.interface.ts         # Response Interface
```

#### ไฟล์สำคัญ

##### 🔴 Global Exception Filter

```typescript
// http-exception.filter.ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

**การใช้งาน**: จัดการ Errors ทั้งหมดให้เป็นรูปแบบเดียวกัน

##### 🔵 Response Interceptor

```typescript
// response.interceptor.ts
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

**การใช้งาน**: Transform ทุก Response ให้มีโครงสร้างแบบเดียวกัน

---

### 🏠 6. App Module (`src/app.module.ts`)

**Root Module** ของแอปพลิเคชัน - รวม modules ทั้งหมดเข้าด้วยกัน

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // ทำให้ใช้ได้ทุก module
    }),
    PrismaModule,      // Database
    AuthModule,        // Authentication
    UsersModule,       // User Management
    TransactionsModule,// Transaction Management
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

### 🚀 7. Main Entry Point (`src/main.ts`)

**Entry Point** ของแอปพลิเคชัน - ตั้งค่าและเริ่มต้น NestJS App

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Set global prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Expense Tracker API')
    .setDescription('API สำหรับบันทึกรายรับ-รายจ่าย')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Global Filters & Interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
```

---

## ไฟล์คอนฟิก

### ⚙️ Configuration Files

#### 1. `package.json`

**คำอธิบาย**: กำหนด dependencies และ scripts

**Scripts สำคัญ**:
```json
{
  "scripts": {
    "build": "nest build",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "format": "prettier --write \"src/**/*.ts\"",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

#### 2. `tsconfig.json`

**คำอธิบาย**: TypeScript Configuration

**สำคัญ**:
- `target`: ES2021
- `module`: commonjs
- `strict`: true
- `esModuleInterop`: true
- `decorators`: enabled

#### 3. `nest-cli.json`

**คำอธิบาย**: NestJS CLI Configuration

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

#### 4. `prisma/schema.prisma`

**คำอธิบาย**: Database Schema Definition

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  transactions Transaction[]
}

model Transaction {
  id       Int             @id @default(autoincrement())
  title    String
  amount   Int      
  type     TransactionType
  category String   
  date     DateTime @default(now())
  userId   Int
  user     User     @relation(fields: [userId], references: [id])
}

enum TransactionType {
  INCOME
  EXPENSE
}
```

#### 5. `docker-compose.yml`

**คำอธิบาย**: Docker Services Configuration

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
```

#### 6. `.env.example`

**คำอธิบาย**: ตัวอย่าง Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
POSTGRES_USER="username"
POSTGRES_PASSWORD="password"
POSTGRES_DB="database_name"
POSTGRES_PORT="5432"
JWT_SECRET="your-secret-key-here"
```

---

## File Naming Conventions

### 📝 NestJS Conventions

โปรเจคนี้ใช้ **NestJS Standard Naming Conventions**:

| Type | Pattern | Example |
|------|---------|---------|
| **Controller** | `*.controller.ts` | `auth.controller.ts` |
| **Service** | `*.service.ts` | `auth.service.ts` |
| **Module** | `*.module.ts` | `auth.module.ts` |
| **DTO** | `*.dto.ts` | `create-user.dto.ts` |
| **Entity** | `*.entity.ts` | `user.entity.ts` |
| **Interface** | `*.interface.ts` | `jwt-payload.interface.ts` |
| **Guard** | `*.guard.ts` | `jwt-auth.guard.ts` |
| **Filter** | `*.filter.ts` | `http-exception.filter.ts` |
| **Interceptor** | `*.interceptor.ts` | `response.interceptor.ts` |
| **Decorator** | `*.decorator.ts` | `public.decorator.ts` |
| **Strategy** | `*.strategy.ts` | `jwt.strategy.ts` |
| **Spec (Test)** | `*.spec.ts` | `auth.service.spec.ts` |
| **E2E Test** | `*.e2e-spec.ts` | `app.e2e-spec.ts` |

### 📐 Naming Rules

1. **kebab-case** สำหรับชื่อไฟล์: `create-user.dto.ts`
2. **PascalCase** สำหรับชื่อ class: `CreateUserDto`
3. **camelCase** สำหรับตัวแปรและฟังก์ชัน: `createUser()`
4. **UPPER_SNAKE_CASE** สำหรับ constants: `MAX_RETRY_COUNT`

---

## Module Dependencies

### 🔗 Dependency Graph

```mermaid
graph TD
    A[AppModule] --> B[ConfigModule]
    A --> C[PrismaModule]
    A --> D[AuthModule]
    A --> E[UsersModule]
    A --> F[TransactionsModule]
    
    D --> E
    D --> C
    D --> G[JwtModule]
    D --> H[PassportModule]
    
    E --> C
    F --> C
    
    style A fill:#e1f5ff
    style C fill:#ffe1e1
    style D fill:#e1ffe1
    style E fill:#e1ffe1
    style F fill:#e1ffe1
```

### 📦 Import Relationships

| Module | Imports | Exports |
|--------|---------|---------|
| **AppModule** | ConfigModule, PrismaModule, AuthModule, UsersModule, TransactionsModule | - |
| **AuthModule** | UsersModule, JwtModule, PassportModule | JwtStrategy |
| **UsersModule** | PrismaModule | UsersService |
| **TransactionsModule** | PrismaModule | TransactionsService |
| **PrismaModule** | - | PrismaService (Global) |

---

## สรุป

### 🎯 Key Points

1. **Modular Structure**: แต่ละ feature มี module ของตัวเอง
2. **Clear Separation**: แยก Controllers, Services, DTOs, และ Entities ชัดเจน
3. **Shared Resources**: ใช้ Common module สำหรับ utilities ที่ใช้ร่วมกัน
4. **NestJS Conventions**: ปฏิบัติตาม NestJS best practices
5. **Type Safety**: ใช้ TypeScript อย่างเต็มที่

### 📚 เอกสารที่เกี่ยวข้อง

- [Hexagonal Architecture](HEXAGONAL_ARCHITECTURE.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)
- [API Guide](API_GUIDE.md)
- [Database Schema](DATABASE_SCHEMA.md)
