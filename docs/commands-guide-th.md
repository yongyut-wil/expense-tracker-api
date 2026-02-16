# 🎮 คู่มือคำสั่งทั้งหมด (Commands Reference)

> รวบรวมคำสั่งที่ใช้บ่อยในการพัฒนา Expense Tracker API

## 📋 สารบัญ

- [การติดตั้ง](#การติดตั้ง)
- [Development](#development)
- [Build & Production](#build--production)
- [Testing](#testing)
- [Database & Prisma](#database--prisma)
- [Docker](#docker)
- [Code Quality](#code-quality)
- [Debugging](#debugging)

---

## 🚀 การติดตั้ง

### ติดตั้ง Dependencies

```bash
# ใช้ Yarn (แนะนำ)
yarn install

# หรือใช้ npm
npm install
```

### Setup Project ใหม่

```bash
# Clone project
git clone <repository-url>
cd expense-tracker-api

# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Setup database (ถ้าใช้ Docker)
docker compose up -d db

# Run migrations
yarn prisma migrate deploy
yarn prisma generate

# Start development server
yarn start:dev
```

---

## 💻 Development

### รัน Development Server

```bash
# รันในโหมด watch (auto-reload)
yarn start:dev

# รันในโหมด debug
yarn start:debug

# รันแบบปกติ (ไม่ auto-reload)
yarn start
```

**URL**: `http://localhost:3000`  
**Swagger**: `http://localhost:3000/api`

### สร้าง Module/Service/Controller ใหม่

```bash
# สร้าง module
nest g module <module-name>

# สร้าง controller
nest g controller <controller-name>

# สร้าง service
nest g service <service-name>

# สร้าง resource (module + controller + service + dto)
nest g resource <resource-name>

# ตัวอย่าง
nest g resource budgets
```

---

## 📦 Build & Production

### Build Project

```bash
# Build โปรเจค
yarn build

# ลบ dist folder แล้ว build ใหม่
rm -rf dist && yarn build
```

### รัน Production

```bash
# รัน production build
yarn start:prod

# หรือใช้ Node โดยตรง
node dist/main
```

### Production with PM2

```bash
# ติดตั้ง PM2
npm install -g pm2

# รัน app ด้วย PM2
pm2 start dist/main.js --name expense-tracker-api

# ดู status
pm2 status

# ดู logs
pm2 logs expense-tracker-api

# Restart
pm2 restart expense-tracker-api

# Stop
pm2 stop expense-tracker-api

# Delete
pm2 delete expense-tracker-api
```

---

## 🧪 Testing

### Unit Tests

```bash
# รัน unit tests ทั้งหมด
yarn test

# รันในโหมด watch
yarn test:watch

# รัน test เฉพาะไฟล์
yarn test <file-pattern>

# ตัวอย่าง
yarn test user.service
```

### Test Coverage

```bash
# ดู test coverage
yarn test:cov

# เปิด coverage report (HTML)
open coverage/lcov-report/index.html
```

### E2E Tests

```bash
# รัน end-to-end tests
yarn test:e2e

# E2E tests ในโหมด watch
yarn test:e2e --watch
```

---

## 🗄️ Database & Prisma

### Prisma Schema

```bash
# Format schema
yarn prisma format

# Validate schema
yarn prisma validate

# Generate Prisma Client
yarn prisma generate
```

### Migrations

```bash
# สร้าง migration ใหม่ (development)
yarn prisma migrate dev --name <migration-name>

# ตัวอย่าง
yarn prisma migrate dev --name add_budget_table

# Deploy migrations (production)
yarn prisma migrate deploy

# Reset database (ลบข้อมูลทั้งหมด)
yarn prisma migrate reset

# ดู migration status
yarn prisma migrate status

# สร้าง migration แบบ draft (ไม่ apply)
yarn prisma migrate dev --create-only
```

### Database Operations

```bash
# เปิด Prisma Studio (GUI)
yarn prisma studio

# Push schema ไป database (ไม่ใช้ migration)
yarn prisma db push

# Pull schema จาก database
yarn prisma db pull

# Seed database
yarn prisma db seed
```

### ดูข้อมูลใน Database

```bash
# ใช้ Prisma Studio
yarn prisma studio
# เปิดที่ http://localhost:5555

# หรือใช้ psql
psql -U postgres -d expense_tracker

# คำสั่ง psql
\dt          # แสดงตาราง
\d users     # ดู schema ของตาราง users
SELECT * FROM users LIMIT 10;
\q           # ออก
```

---

## 🐳 Docker

### Docker Compose

```bash
# รันทั้ง API + Database
docker compose up -d

# รันเฉพาะ database
docker compose up -d db

# ดู logs
docker compose logs -f

# ดู logs เฉพาะ service
docker compose logs -f api
docker compose logs -f db

# Stop services
docker compose stop

# Stop และลบ containers
docker compose down

# Stop และลบทั้ง containers + volumes (ลบข้อมูล)
docker compose down -v

# Restart services
docker compose restart

# Rebuild และรัน
docker compose up -d --build
```

### Docker Commands

```bash
# Build image
docker build -t expense-tracker-api .

# Build with tag
docker build -t expense-tracker-api:1.0.0 .

# รัน container
docker run -p 3000:3000 expense-tracker-api

# รัน container แบบ detached
docker run -d -p 3000:3000 --name api expense-tracker-api

# ดู containers ที่รันอยู่
docker ps

# ดู logs
docker logs api
docker logs -f api  # follow mode

# เข้าไปใน container
docker exec -it api sh
docker exec -it api bash

# Stop container
docker stop api

# Start container
docker start api

# ลบ container
docker rm api

# ลบ image
docker rmi expense-tracker-api
```

### Docker Database

```bash
# เข้าไปใน PostgreSQL container
docker exec -it expense-tracker-db psql -U postgres

# Backup database
docker exec expense-tracker-db pg_dump -U postgres expense_tracker > backup.sql

# Restore database
docker exec -i expense-tracker-db psql -U postgres expense_tracker < backup.sql

# ดู database size
docker exec expense-tracker-db psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('expense_tracker'));"
```

---

## ✅ Code Quality

### Linting

```bash
# รัน ESLint
yarn lint

# แก้ไข lint issues อัตโนมัติ
yarn lint --fix

# Lint เฉพาะไฟล์
yarn lint src/users/**/*.ts
```

### Formatting

```bash
# Format code ด้วย Prettier
yarn format

# Check formatting
yarn format --check
```

### Type Checking

```bash
# ตรวจสอบ TypeScript types
yarn tsc --noEmit

# ตรวจสอบแบบ watch mode
yarn tsc --noEmit --watch
```

---

## 🐛 Debugging

### Debug Mode

```bash
# รันในโหมด debug
yarn start:debug

# Debug จะรันที่ port 9229
```

**ใช้กับ VS Code**:
1. ไปที่ Run and Debug (Cmd+Shift+D)
2. เลือก "Attach to NestJS"
3. กด F5

### Debug Configuration (VS Code)

สร้างไฟล์ `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to NestJS",
      "port": 9229,
      "restart": true,
      "stopOnEntry": false
    }
  ]
}
```

### Logs

```bash
# ดู logs ใน development
yarn start:dev
# NestJS จะแสดง logs อัตโนมัติ

# ดู logs ใน Docker
docker compose logs -f api

# ดู logs เฉพาะ errors
docker compose logs api | grep ERROR
```

---

## 📊 Database Management

### การ Backup/Restore

```bash
# Backup (local database)
pg_dump -U postgres expense_tracker > backup.sql

# Backup (Docker)
docker exec expense-tracker-db pg_dump -U postgres expense_tracker > backup.sql

# Restore (local)
psql -U postgres expense_tracker < backup.sql

# Restore (Docker)
docker exec -i expense-tracker-db psql -U postgres expense_tracker < backup.sql

# Backup with compression
pg_dump -U postgres expense_tracker | gzip > backup.sql.gz

# Restore from compressed
gunzip < backup.sql.gz | psql -U postgres expense_tracker
```

---

## 🔍 Useful Commands

### ตรวจสอบ Port

```bash
# ดูว่า port 3000 ถูกใช้โดยโปรแกรมไหน
lsof -i :3000

# Kill process ที่ใช้ port 3000
lsof -ti :3000 | xargs kill -9
```

### ตรวจสอบ Environment

```bash
# ดูค่า environment variables
printenv | grep DATABASE

# ดูเฉพาะค่าที่ต้องการ
echo $DATABASE_URL
echo $JWT_SECRET
```

### ดูขนาดโปรเจค

```bash
# นับจำนวน lines of code
find src -name "*.ts" | xargs wc -l

# ดูขนาดไฟล์
du -sh dist/
du -sh node_modules/
```

---

## 🚢 Deployment

### Build for Production

```bash
# 1. Build project
yarn build

# 2. ตรวจสอบว่า build สำเร็จ
ls -lh dist/

# 3. Test production build locally
NODE_ENV=production yarn start:prod

# 4. Deploy (ขึ้นอยู่กับ platform)
```

### Environment Variables (Production)

```bash
# ตั้งค่า environment variables
export NODE_ENV=production
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export JWT_SECRET="your-production-secret"

# หรือใช้ .env.production
cp .env.example .env.production
```

---

## 📚 Quick Reference

### คำสั่งที่ใช้บ่อยที่สุด

```bash
# Development
yarn start:dev              # รัน dev server
yarn prisma studio          # เปิด database GUI

# Database
yarn prisma migrate dev     # สร้าง migration
yarn prisma generate        # Generate Prisma Client

# Testing
yarn test                   # Unit tests
yarn test:e2e               # E2E tests

# Code Quality
yarn lint                   # Check linting
yarn format                 # Format code

# Docker
docker compose up -d        # รัน services
docker compose logs -f      # ดู logs
docker compose down         # หยุด services
```

---

## 💡 Tips & Tricks

### 1. Auto-reload ช้า?

```bash
# ใช้ SWC แทน TypeScript compiler (เร็วกว่า)
# โปรเจคนี้ใช้อยู่แล้ว!
```

### 2. Database reset อย่างเดียว (ไม่ลบ schema)

```bash
# Truncate ตารางแทนการ reset
yarn prisma db seed
```

### 3. Debug Prisma Queries

```bash
# เพิ่มใน .env
DEBUG="prisma:query"

# จะเห็น SQL queries ทั้งหมด
```

### 4. Watch mode สำหรับหลายคำสั่ง

```bash
# ใช้ concurrently
npm install -g concurrently

concurrently "yarn start:dev" "yarn prisma studio"
```

---

**อัพเดทล่าสุด**: 16 February 2026
