# 🎮 คำสั่งที่ใช้ในโปรเจค Expense Tracker API

## สารบัญ

- [คำสั่งเริ่มต้น](#คำสั่งเริ่มต้น)
- [Development Commands](#development-commands)
- [Code Quality Commands](#code-quality-commands)
- [Testing Commands](#testing-commands)
- [Database/Prisma Commands](#databaseprisma-commands)
- [Docker Commands](#docker-commands)
- [Git Commands](#git-commands)
- [Production Commands](#production-commands)
- [Troubleshooting Commands](#troubleshooting-commands)

---

## คำสั่งเริ่มต้น

### 🚀 Quick Start

```bash
# 1. Clone โปรเจค
git clone <repository-url>
cd expense-tracker-api

# 2. ติดตั้ง dependencies
yarn install

# 3. ตั้งค่า environment variables
cp .env.example .env
# แก้ไขไฟล์ .env ตามความต้องการ

# 4. รัน database ด้วย Docker
docker-compose up -d db

# 5. รัน migrations
npx prisma migrate deploy

# 6. Generate Prisma Client
npx prisma generate

# 7. รันโปรเจค
yarn start:dev
```

---

## Development Commands

### 📦 Package Management

```bash
# ติดตั้ง dependencies
yarn install

# เพิ่ม package ใหม่
yarn add <package-name>

# เพิ่ม dev dependency
yarn add -D <package-name>

# ลบ package
yarn remove <package-name>

# อัพเดท dependencies
yarn upgrade

# ตรวจสอบ outdated packages
yarn outdated
```

### 🏃 Running the Application

```bash
# รันในโหมด development (auto-restart)
yarn start:dev

# รันแบบปกติ
yarn start

# รันในโหมด debug (port 9229)
yarn start:debug

# รัน production build
yarn start:prod
```

**อธิบาย**:
- `yarn start:dev`: ใช้ในระหว่างพัฒนา มี **hot-reload** จะ restart อัตโนมัติเมื่อมีการแก้ไข
- `yarn start:debug`: เปิดโหมด debug สามารถใช้ debugger ต่อที่ port `9229`
- `yarn start:prod`: รัน compiled code จากโฟลเดอร์ `dist/`

### 🔨 Building

```bash
# Build โปรเจคสำหรับ production
yarn build

# ลบไฟล์ที่ build แล้ว
rm -rf dist/

# Build และรัน
yarn build && yarn start:prod
```

---

## Code Quality Commands

### ✨ Formatting

```bash
# Format โค้ดด้วย Prettier
yarn format

# ตรวจสอบว่าโค้ดถูก format หรือไม่
npx prettier --check "src/**/*.ts"

# Format file เฉพาะ
npx prettier --write src/auth/auth.service.ts
```

**การตั้งค่า Prettier** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 🔍 Linting

```bash
# Lint และแก้ไขโค้ด
yarn lint

# Lint โดยไม่แก้ไข
npx eslint "{src,apps,libs,test}/**/*.ts"

# Lint file เฉพาะ
npx eslint src/auth/auth.service.ts --fix
```

**การตั้งค่า ESLint** ([eslint.config.mjs](file:///Users/yongyut/Project/Personal/expense-tracker-api/eslint.config.mjs))

---

## Testing Commands

### 🧪 Unit Tests

```bash
# รัน unit tests ทั้งหมด
yarn test

# รันในโหมด watch (auto-rerun)
yarn test:watch

# รันและดู coverage
yarn test:cov

# รัน test เฉพาะไฟล์
yarn test auth.service.spec.ts

# รันในโหมด debug
yarn test:debug
```

**ตัวอย่างผลลัพธ์**:
```
PASS  src/auth/auth.service.spec.ts
PASS  src/users/users.service.spec.ts
Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
```

### 🔬 E2E Tests

```bash
# รัน end-to-end tests
yarn test:e2e

# รัน e2e ในโหมด watch
yarn test:e2e --watch

# รัน e2e พร้อม coverage
yarn test:e2e --coverage
```

**หมายเหตุ**: E2E tests ต้องการ database ที่รันอยู่

### 📊 Coverage Report

```bash
# Generate coverage report
yarn test:cov

# เปิด coverage report ใน browser
open coverage/lcov-report/index.html
```

---

## Database/Prisma Commands

### 🗄️ Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ไปยัง database (development only)
npx prisma db push

# เปิด Prisma Studio (Database GUI)
npx prisma studio
```

**Prisma Studio**: เปิดที่ `http://localhost:5555`

### 🔄 Migrations

```bash
# สร้าง migration ใหม่
npx prisma migrate dev --name <migration-name>

# ตัวอย่าง: เพิ่ม field ใหม่
npx prisma migrate dev --name add_phone_to_user

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (ลบข้อมูลทั้งหมด)
npx prisma migrate reset

# ดู status ของ migrations
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve --applied <migration-name>
```

**คำแนะนำ**:
- `migrate dev`: ใช้ในโหมด development (สร้าง migration และ apply อัตโนมัติ)
- `migrate deploy`: ใช้ใน production (apply migrations ที่มีอยู่)
- `migrate reset`: **อันตราย!** จะลบข้อมูลทั้งหมดและ rerun migrations

### 📋 Database Management

```bash
# ดูข้อมูลใน database
npx prisma studio

# Seed database (ถ้ามี seed file)
npx prisma db seed

# ตรวจสอบความสอดคล้องระหว่าง schema กับ database
npx prisma validate

# Pull schema จาก existing database
npx prisma db pull

# Format schema file
npx prisma format
```

### 🔍 Prisma Debugging

```bash
# เปิด debug logs
DEBUG="prisma:*" yarn start:dev

# ดู SQL queries ที่ถูกสร้าง
npx prisma studio --browser none
```

---

## Docker Commands

### 🐳 Docker Compose

```bash
# รัน services ทั้งหมด (detached mode)
docker-compose up -d

# รัน database อย่างเดียว
docker-compose up -d db

# หยุด services
docker-compose down

# หยุดและลบ volumes (ลบข้อมูล database)
docker-compose down -v

# ดู logs
docker-compose logs -f

# ดู logs เฉพาะ service
docker-compose logs -f db

# ตรวจสอบสถานะ services
docker-compose ps

# Restart service
docker-compose restart db

# Stop service
docker-compose stop db

# Start service ที่ stop แล้ว
docker-compose start db
```

### 🔧 Docker Container Management

```bash
# ดู containers ที่รันอยู่
docker ps

# ดู containers ทั้งหมด (รวมที่ stop)
docker ps -a

# เข้าไปใน container
docker exec -it <container-id> bash

# ดู logs ของ container
docker logs <container-id>

# ลบ container
docker rm <container-id>

# ลบ container ที่ stop แล้วทั้งหมด
docker container prune
```

### 🗄️ Database Container

```bash
# เข้าไปใน PostgreSQL container
docker exec -it expense-tracker-api-db-1 psql -U postgres

# Backup database
docker exec expense-tracker-api-db-1 pg_dump -U postgres expense_tracker > backup.sql

# Restore database
docker exec -i expense-tracker-api-db-1 psql -U postgres expense_tracker < backup.sql

# ดู database size
docker exec expense-tracker-api-db-1 psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('expense_tracker'));"
```

### 🖼️ Docker Images

```bash
# Build image
docker build -t expense-tracker-api .

# ดู images ทั้งหมด
docker images

# ลบ image
docker rmi <image-id>

# ลบ images ที่ไม่ได้ใช้
docker image prune -a

# Push image ไปยัง registry
docker push <registry-url>/expense-tracker-api:latest
```

---

## Git Commands

### 📝 Common Workflow

```bash
# ดูสถานะ
git status

# เพิ่มไฟล์เข้า staging
git add .
git add src/auth/auth.service.ts

# Commit
git commit -m "feat: add authentication module"

# Push
git push origin main

# Pull ล่าสุด
git pull origin main

# ดู commit history
git log --oneline -10
```

### 🌿 Branch Management

```bash
# สร้าง branch ใหม่
git checkout -b feature/add-categories

# เปลี่ยน branch
git checkout main

# ดู branches ทั้งหมด
git branch -a

# ลบ branch
git branch -d feature/add-categories

# Merge branch
git merge feature/add-categories
```

### 🔄 Reset & Revert

```bash
# Undo การแก้ไขที่ยังไม่ commit
git checkout -- src/auth/auth.service.ts

# Unstage file
git reset HEAD src/auth/auth.service.ts

# Reset ไปยัง commit ก่อนหน้า (อันตราย!)
git reset --hard HEAD~1

# Revert commit (สร้าง commit ใหม่)
git revert <commit-hash>
```

---

## Production Commands

### 🚀 Deployment

```bash
# Build สำหรับ production
yarn build

# รัน production server
NODE_ENV=production yarn start:prod

# ตั้งค่า environment variables
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export JWT_SECRET="your-secret-key"

# Deploy migrations
npx prisma migrate deploy

# ตรวจสอบ health
curl http://localhost:3000/api
```

### 📊 Monitoring

```bash
# ดู process ที่รันอยู่
ps aux | grep node

# ดู memory usage
top -p $(pgrep -f "node dist/main")

# ดู logs
tail -f logs/app.log

# ตรวจสอบ API
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### 🔒 Security

```bash
# ตรวจสอบ security vulnerabilities
yarn audit

# แก้ไข vulnerabilities
yarn audit fix

# ตรวจสอบ outdated packages
yarn outdated

# Update packages
yarn upgrade-interactive
```

---

## Troubleshooting Commands

### 🐛 Debug Commands

```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules yarn.lock
yarn install

# ลบ Prisma Client และ generate ใหม่
rm -rf node_modules/.prisma
npx prisma generate

# ตรวจสอบว่า port ถูกใช้งานหรือไม่
lsof -i :3000

# Kill process ที่ใช้ port
kill -9 $(lsof -t -i:3000)

# ตรวจสอบการเชื่อมต่อ database
psql -h localhost -U postgres -d expense_tracker

# ดู environment variables
printenv | grep DATABASE
```

### 🔍 Logging

```bash
# รันพร้อม debug logs
DEBUG=* yarn start:dev

# ดู Prisma queries
DEBUG="prisma:query" yarn start:dev

# บันทึก logs ลงไฟล์
yarn start:prod > app.log 2>&1
```

### 🏥 Health Checks

```bash
# ตรวจสอบว่า API รันอยู่หรือไม่
curl http://localhost:3000/api

# ตรวจสอบ database connection
docker exec expense-tracker-api-db-1 pg_isready

# ตรวจสอบ Swagger docs
curl http://localhost:3000/api-docs
```

---

## คำสั่งที่ใช้บ่อย (Quick Reference)

### 📋 Development

```bash
yarn install              # ติดตั้ง dependencies
yarn start:dev           # รันในโหมด development
yarn build               # Build สำหรับ production
yarn format              # Format โค้ด
yarn lint                # Lint โค้ด
yarn test                # รัน tests
```

### 📋 Database

```bash
npx prisma generate                        # Generate Prisma Client
npx prisma migrate dev --name <name>      # สร้าง migration
npx prisma migrate deploy                 # Deploy migrations
npx prisma studio                         # เปิด Database GUI
npx prisma migrate reset                  # Reset database
```

### 📋 Docker

```bash
docker-compose up -d              # รัน services
docker-compose up -d db           # รัน database อย่างเดียว
docker-compose down               # หยุด services
docker-compose logs -f            # ดู logs
docker-compose ps                 # ดูสถานะ
```

---

## Environment Variables Reference

### 🔐 Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db_name"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="your_password"
POSTGRES_DB="expense_tracker"
POSTGRES_PORT="5432"

# JWT
JWT_SECRET="your-secret-key-change-in-production"

# Server
PORT="3000"
NODE_ENV="development"
```

### ⚙️ Optional Variables

```bash
# Logging
LOG_LEVEL="info"
LOG_FILE="logs/app.log"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# Rate Limiting
RATE_LIMIT_TTL="60"
RATE_LIMIT_MAX="100"
```

---

## สรุป

### 🎯 คำสั่งที่ต้องจำ

| สถานการณ์ | คำสั่ง |
|-----------|--------|
| เริ่มพัฒนา | `yarn start:dev` |
| สร้าง migration | `npx prisma migrate dev --name <name>` |
| ดูข้อมูล database | `npx prisma studio` |
| รัน tests | `yarn test` |
| Format โค้ด | `yarn format` |
| Build production | `yarn build` |
| รัน Docker | `docker-compose up -d` |

### 📚 เอกสารที่เกี่ยวข้อง

- [Project Structure](PROJECT_STRUCTURE.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)
- [Hexagonal Architecture](HEXAGONAL_ARCHITECTURE.md)
- [API Guide](API_GUIDE.md)
