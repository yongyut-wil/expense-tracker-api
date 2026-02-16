# 💰 Expense Tracker API

API สำหรับระบบบันทึกรายรับ-รายจ่าย พัฒนาด้วย NestJS, Prisma และ PostgreSQL

## สารบัญ

- [คุณสมบัติ](#คุณสมบัติ)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [ข้อกำหนดเบื้องต้น](#ข้อกำหนดเบื้องต้น)
- [การติดตั้ง](#การติดตั้ง)
- [การตั้งค่า](#การตั้งค่า)
- [การรันโปรเจค](#การรันโปรเจค)
- [API Documentation](#api-documentation)
- [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
- [API Endpoints](#api-endpoints)
- [การใช้งาน Docker](#การใช้งาน-docker)
- [การทดสอบ](#การทดสอบ)
- [เอกสารเพิ่มเติม](#เอกสารเพิ่มเติม)

## คุณสมบัติ

- ระบบ Authentication ด้วย JWT
- จัดการรายการรายรับ-รายจ่าย (เพิ่ม แก้ไข ลบ ดูรายการ)
- แยกประเภทและหมวดหมู่รายการ
- จัดการข้อมูลผู้ใช้และโปรไฟล์
- เข้ารหัสรหัสผ่านด้วย bcrypt
- API Documentation ด้วย Swagger
- รองรับ Docker และ Docker Compose
- Validation ข้อมูลด้วย class-validator
- รองรับ CORS

## 🛠 เทคโนโลยีที่ใช้

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: [TypeScript](https://www.typescriptlang.org/) v5.7
- **Database**: [PostgreSQL](https://www.postgresql.org/) 15
- **ORM**: [Prisma](https://www.prisma.io/) v7.2
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Package Manager**: Yarn

## ข้อกำหนดเบื้องต้น

ต้องติดตั้งโปรแกรมต่อไปนี้ก่อน:

- **Node.js** v24.x หรือสูงกว่า
- **Yarn** v1.22 หรือสูงกว่า
- **PostgreSQL** v15 หรือสูงกว่า (หรือใช้ Docker)
- **Docker** และ **Docker Compose** (ถ้าต้องการรันด้วย Docker)

## การติดตั้ง

### 1. Clone โปรเจค

```bash
git clone <repository-url>
cd expense-tracker-api
```

### 2. ติดตั้ง Dependencies

```bash
yarn install
```

### 3. ตั้งค่า Environment Variables

คัดลอกไฟล์ `.env.example` เป็น `.env`:

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env` ตามความต้องการ:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# PostgreSQL (for Docker)
POSTGRES_USER="username"
POSTGRES_PASSWORD="password"
POSTGRES_DB="database_name"
POSTGRES_PORT="5432"

# JWT
JWT_SECRET="your-secret-key-here"

```

### 4. ตั้งค่าฐานข้อมูล

#### วิธีที่ 1: ใช้ PostgreSQL ที่ติดตั้งในเครื่อง

สร้างฐานข้อมูล:

```bash
# เข้าสู่ PostgreSQL
psql -U postgres

# สร้างฐานข้อมูล
CREATE DATABASE expense_tracker;

# ออกจาก PostgreSQL
\q
```

#### วิธีที่ 2: ใช้ Docker (แนะนำ)

```bash
# รัน PostgreSQL ด้วย Docker Compose
docker-compose up -d db
```

### 5. รัน Prisma Migrations

```bash
# สร้างตารางในฐานข้อมูล
npx prisma migrate dev

# หรือถ้าใช้ Docker
npx prisma migrate deploy
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

## การตั้งค่า

### Environment Variables

| ตัวแปร | คำอธิบาย | ค่าเริ่มต้น |
|--------|----------|------------|
| `DATABASE_URL` | URL เชื่อมต่อฐานข้อมูล PostgreSQL | - |
| `POSTGRES_USER` | ชื่อผู้ใช้ PostgreSQL | - |
| `POSTGRES_PASSWORD` | รหัสผ่าน PostgreSQL | - |
| `POSTGRES_DB` | ชื่อฐานข้อมูล | - |
| `POSTGRES_PORT` | พอร์ตของ PostgreSQL | `5432` |
| `JWT_SECRET` | Secret key สำหรับ JWT | - |
| `PORT` | พอร์ตของ API | `3000` |
| `NODE_ENV` | สภาพแวดล้อม (development/production) | `development` |

## การรันโปรเจค

### Development Mode

```bash
# รันในโหมด watch (รีสตาร์ทอัตโนมัติเมื่อมีการแก้ไขไฟล์)
yarn start:dev
```

### Production Mode

```bash
# Build โปรเจค
yarn build

# รัน production build
yarn start:prod
```

### Debug Mode

```bash
# รันในโหมด debug
yarn start:debug
```

API จะรันที่ `http://localhost:3000`

## API Documentation

เมื่อรันโปรเจคแล้ว สามารถเข้าถึง Swagger API Documentation ได้ที่:

```
http://localhost:3000/api-docs
```

Swagger UI จะแสดง:
- รายการ API endpoints ทั้งหมด
- Request/Response schemas
- ทดสอบ API ได้โดยตรง
- ตัวอย่างการใช้งาน

## โครงสร้างฐานข้อมูล

### User (ผู้ใช้)

| ฟิลด์ | ประเภท | คำอธิบาย |
|------|--------|----------|
| `id` | Int | รหัสผู้ใช้ (Primary Key) |
| `email` | String | อีเมล (Unique) |
| `password` | String | รหัสผ่าน (เข้ารหัสแล้ว) |
| `name` | String? | ชื่อผู้ใช้ (Optional) |
| `createdAt` | DateTime | วันที่สร้าง |
| `updatedAt` | DateTime | วันที่อัปเดต |

### Transaction (รายการธุรกรรม)

| ฟิลด์ | ประเภท | คำอธิบาย |
|------|--------|----------|
| `id` | Int | รหัสธุรกรรม (Primary Key) |
| `title` | String | ชื่อรายการ |
| `amount` | Int | จำนวนเงิน |
| `type` | TransactionType | ประเภท (INCOME/EXPENSE) |
| `category` | String | หมวดหมู่ |
| `date` | DateTime | วันที่ทำรายการ |
| `userId` | Int | รหัสผู้ใช้ (Foreign Key) |

### TransactionType (ประเภทธุรกรรม)

- `INCOME` - รายรับ
- `EXPENSE` - รายจ่าย

## API Endpoints

### Authentication

| Method | Endpoint | คำอธิบาย | Authentication |
|--------|----------|----------|----------------|
| POST | `/api/auth/register` | ลงทะเบียนผู้ใช้ใหม่ | ไม่ต้อง |
| POST | `/api/auth/login` | เข้าสู่ระบบ | ไม่ต้อง |
| GET | `/api/auth/me` | ดูข้อมูลผู้ใช้ปัจจุบัน | ต้องการ |

### Users

| Method | Endpoint | คำอธิบาย | Authentication |
|--------|----------|----------|----------------|
| GET | `/api/users` | ดูรายการผู้ใช้ทั้งหมด | ต้องการ |
| GET | `/api/users/:id` | ดูข้อมูลผู้ใช้ตาม ID | ต้องการ |
| PATCH | `/api/users/:id` | แก้ไขข้อมูลผู้ใช้ | ต้องการ |
| DELETE | `/api/users/:id` | ลบผู้ใช้ | ต้องการ |

### Transactions

| Method | Endpoint | คำอธิบาย | Authentication |
|--------|----------|----------|----------------|
| GET | `/api/transactions` | ดูรายการธุรกรรมทั้งหมด | ต้องการ |
| GET | `/api/transactions/:id` | ดูข้อมูลธุรกรรมตาม ID | ต้องการ |
| POST | `/api/transactions` | สร้างรายการธุรกรรมใหม่ | ต้องการ |
| PATCH | `/api/transactions/:id` | แก้ไขรายการธุรกรรม | ต้องการ |
| DELETE | `/api/transactions/:id` | ลบรายการธุรกรรม | ต้องการ |

### ตัวอย่างการใช้งาน

#### ลงทะเบียน

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

#### เข้าสู่ระบบ

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### สร้างรายการธุรกรรม

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "เงินเดือน",
    "amount": 30000,
    "type": "INCOME",
    "category": "เงินเดือน",
    "date": "2026-01-20T00:00:00.000Z"
  }'
```

## การใช้งาน Docker

### รันด้วย Docker Compose (แนะนำ)

```bash
# รันทั้ง API และ Database
docker-compose up -d

# ดู logs
docker-compose logs -f

# หยุดการทำงาน
docker-compose down

# หยุดและลบข้อมูล
docker-compose down -v
```

### รัน Database อย่างเดียว

```bash
# รัน PostgreSQL
docker-compose up -d db

# ตรวจสอบสถานะ
docker-compose ps
```

### Build Docker Image

```bash
# Build image
docker build -t expense-tracker-api .

# รัน container
docker run -p 3000:3000 expense-tracker-api
```

## การทดสอบ

### Unit Tests

```bash
# รัน unit tests
yarn test

# รันในโหมด watch
yarn test:watch

# ดู test coverage
yarn test:cov
```

### E2E Tests

```bash
# รัน end-to-end tests
yarn test:e2e
```

## Architecture

โปรเจคนี้ใช้ **Hexagonal Architecture** (Ports and Adapters Pattern) เพื่อแยก Business Logic ออกจาก Technical Details โดยมี 3 ชั้นหลัก:

- **Domain Layer**: Business Logic และ Entity
- **Application Layer**: Use Cases และ DTOs
- **Infrastructure Layer**: Controllers, Database, External Services

อ่านเพิ่มเติมได้ที่ [Hexagonal Architecture Guide](docs/HEXAGONAL_ARCHITECTURE.md)

## เอกสารเพิ่มเติม

### 📚 เอกสารหลัก

- 🇹🇭 **[README ภาษาไทย](./README-TH.md)** - คู่มือฉบับภาษาไทยแบบละเอียด
- **[🏗️ Hexagonal Architecture](docs/HEXAGONAL_ARCHITECTURE.md)** - อธิบายสถาปัตยกรรมและการออกแบบระบบ
-🏗️ **[Architecture Guide (TH)](docs/architecture-guide-th.md)** - คู่มือสถาปัตยกรรมภาษาไทย
- 🎯 **[Path Aliases Guide](docs/path_aliases_guide.md)** - วิธีใช้ Path Aliases (`@domain/*`, `@application/*`)
- 🎮 **[Commands Guide (TH)](docs/commands-guide-th.md)** - รวมคำสั่งทั้งหมดภาษาไทย
- 🐳 **[Docker Guide (TH)](docs/docker-guide-th.md)** - คู่มือ Docker แบบละเอียด
- 🔧 **[Docker Dev Commands](docs/DOCKER_DEV_COMMANDS.md)** - คำสั่ง Docker สำหรับ Development
- ⚖️ **[Docker Prod vs Dev](docs/DOCKER_PROD_VS_DEV.md)** - เปรียบเทียบ Production และ Development
- 🔄 **[Migration Workflow](docs/MIGRATION_WORKFLOW.md)** - การจัดการ Database Migrations Dev → Prod
- **[📁 Project Structure](docs/PROJECT_STRUCTURE.md)** - โครงสร้างโปรเจคและรายละเอียดแต่ละโมดูล
- **[🎮 Commands Reference](docs/COMMANDS.md)** - คำสั่งที่ใช้ในการพัฒนาทั้งหมด
- **[👨‍💻 Development Guide](docs/DEVELOPMENT_GUIDE.md)** - คู่มือการพัฒนาและ Best Practices

### 🔧 เอกสารเทคนิค

- **[🔌 API Guide](docs/API_GUIDE.md)** - คู่มือการใช้งาน API พร้อมตัวอย่าง
- **[📊 Database Schema](docs/DATABASE_SCHEMA.md)** - โครงสร้างฐานข้อมูลและ Relationships

### 📖 เอกสารอื่นๆ

- **[🔐 Authentication](docs/AUTHENTICATION.md)** - ระบบ Authentication (ถ้ามี)
- **[🐳 Docker Setup](docs/DOCKER_SETUP.md)** - การตั้งค่า Docker (ถ้ามี)
- **[🎨 Frontend Design Prompt](docs/FRONTEND_DESIGN_PROMPT.md)** - Design Guideline สำหรับ Frontend

## คำสั่งที่ใช้บ่อย

```bash
# ติดตั้ง dependencies
yarn install

# รันในโหมด development
yarn start:dev

# Build โปรเจค
yarn build

# รัน production
yarn start:prod

# Format code
yarn format

# Lint code
yarn lint

# Generate Prisma Client
npx prisma generate

# สร้าง migration
npx prisma migrate dev --name migration_name

# Deploy migrations
npx prisma migrate deploy

# เปิด Prisma Studio (GUI สำหรับดูข้อมูล)
npx prisma studio

# Reset database
npx prisma migrate reset
```

## ความปลอดภัย

- รหัสผ่านถูกเข้ารหัสด้วย **bcrypt**
- ใช้ **JWT** สำหรับ authentication
- **CORS** ป้องกันการเข้าถึงจาก origin ที่ไม่ได้รับอนุญาต
- **Validation** ตรวจสอบข้อมูลทุก request
- **Global Exception Filter** จัดการ errors อย่างปลอดภัย

## การมีส่วนร่วม

## License

โปรเจคนี้เป็น open source ภายใต้ [MIT License](LICENSE)

## เทคโนโลยีที่ใช้

- [NestJS](https://nestjs.com/) - Node.js Framework
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database

---

หากพบปัญหาหรือมีข้อสงสัย สามารถเปิด [Issue](https://github.com/yongyut-wil/expense-tracker-api/issues) ได้เลยครับ
