# 🐳 Docker Quick Start Guide

## 📦 สิ่งที่สร้างให้แล้ว

1. **Dockerfile** - Production build (multi-stage)
2. **.dockerignore** - ไฟล์ที่ไม่จำเป็นใน Docker build
3. **docker-compose.yml** - Production environment
4. **docker-compose.dev.yml** - Development environment (hot-reload)
5. **Dockerfile.dev** - Development build

---

## 🚀 การใช้งานด่วน

### สำหรับ Development (แนะนำ)

```bash
# 1. สร้างไฟล์ .env (ถ้ายังไม่มี)
cp .env.example .env

# 2. รัน Docker Compose สำหรับ Development
docker-compose -f docker-compose.dev.yml up -d

# 3. ดู logs
docker-compose -f docker-compose.dev.yml logs -f

# 4. หยุดการทำงาน
docker-compose -f docker-compose.dev.yml down
```

**คุณสมบัติ Development Mode:**
- ✅ Hot-reload (แก้ไขโค้ดแล้วรีสตาร์ทอัตโนมัติ)
- ✅ Volume mounting (ไฟล์ในเครื่องซิงค์กับ container)
- ✅ Database auto-migrate

### สำหรับ Production

```bash
# 1. สร้าง Docker image
docker-compose build

# 2. รัน services
docker-compose up -d

# 3. ดู logs
docker-compose logs -f

# 4. หยุดการทำงาน
docker-compose down
```

---

## 📝 คำสั่งที่ใช้บ่อย

### Docker Compose Commands

```bash
# รัน services ทั้งหมด
docker-compose up -d

# รัน development mode
docker-compose -f docker-compose.dev.yml up -d

# ดู logs แบบ real-time
docker-compose logs -f app

# เข้าไปใน container
docker-compose exec app sh

# รัน Prisma migrations
docker-compose exec app npx prisma migrate deploy

# Rebuild image
docker-compose build --no-cache

# ลบทุกอย่างรวม volumes
docker-compose down -v
```

### Database Management

```bash
# เข้าไปใน PostgreSQL
docker-compose exec postgres psql -U postgres -d expense_tracker

# Backup database
docker-compose exec postgres pg_dump -U postgres expense_tracker > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres expense_tracker < backup.sql
```

---

## 🔧 Environment Variables

ตัวอย่าง `.env` สำหรับ Docker:

```env
# Database
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=expense_tracker
DATABASE_PORT=5432

# Application
PORT=3000
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRES_IN=24h

# For Production
NODE_ENV=production
```

---

## 📊 Docker Files อธิบาย

### Dockerfile (Production)
- **Stage 1**: Build stage - คอมไพล์โค้ด TypeScript
- **Stage 2**: Production stage - รันโค้ดที่คอมไพล์แล้ว
- **ขนาดเล็ก**: ใช้ `node:20-alpine` (~180MB)
- **Optimized**: ติดตั้งเฉพาะ production dependencies

### Dockerfile.dev (Development)
- **Single stage**: ไม่ต้องแยก stage
- **Full dependencies**: รวม dev dependencies
- **Hot-reload**: รองรับการแก้ไขโค้ดแบบ real-time

### .dockerignore
ไม่ include ไฟล์เหล่านี้ใน Docker build:
- `node_modules` (ติดตั้งใหม่ใน container)
- `dist` (build ใหม่)
- `.env` (ใช้ environment variables)
- `docs`, `test`, `.git` (ไม่จำเป็น)

---

## 🎯 Tips & Best Practices

### การพัฒนา (Development)
✅ ใช้ `docker-compose.dev.yml` เพื่อ hot-reload  
✅ Mount volumes เพื่อแก้ไขโค้ดได้ทันที  
✅ ใช้ default passwords ในเครื่องได้

### การ Deploy (Production)
✅ เปลี่ยน `JWT_SECRET` ให้แข็งแรง  
✅ เปลี่ยน database password  
✅ ใช้ environment variables ไม่ hardcode  
✅ ใช้ `docker-compose.yml` สำหรับ production  
✅ Run migrations ก่อน deploy: `npx prisma migrate deploy`

### Health Checks
Dockerfile มี health check ในตัว:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/api', ...)"
```

ตรวจสอบสถานะ:
```bash
docker-compose ps
```

---

## ⚠️ Troubleshooting

### ปัญหา: Port ถูกใช้งานอยู่
```bash
# เช็ค process ที่ใช้ port 3000
lsof -i :3000
# หรือ
netstat -an | grep 3000

# เปลี่ยน port ใน .env
PORT=3001
```

### ปัญหา: Database connection failed
```bash
# ตรวจสอบว่า database รันอยู่หรือไม่
docker-compose ps

# ดู logs ของ database
docker-compose logs postgres

# รีสตาร์ท database
docker-compose restart postgres
```

### ปัญหา: Prisma Client not generated
```bash
# เข้าไปใน container แล้ว generate
docker-compose exec app npx prisma generate
```

### ปัญหา: Out of memory
```bash
# เพิ่ม memory limit ใน docker-compose.yml
services:
  app:
    mem_limit: 1g
```

---

## 📚 อ่านเพิ่มเติม

- **[Docker Guide (TH)](./docs/docker-guide-th.md)** - คู่มือ Docker แบบละเอียด
- **[Commands Guide (TH)](./docs/commands-guide-th.md)** - คำสั่งทั้งหมด
- **[README-TH](./README-TH.md)** - คู่มือโปรเจคภาษาไทย

---

**สร้างโดย**: Antigravity AI  
**วันที่**: February 16, 2026
