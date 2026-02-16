# 🐳 คู่มือ Docker Development Commands

> คำสั่งที่ใช้บ่อยสำหรับการพัฒนาด้วย Docker

---

## 🚀 เริ่มต้นใช้งาน

### รัน Development Environment

```bash
# รัน Docker containers (detached mode)
docker-compose -f docker-compose.dev.yml up -d

# รัน และดู logs แบบ real-time
docker-compose -f docker-compose.dev.yml up

# รัน เฉพาะ service ที่ต้องการ
docker-compose -f docker-compose.dev.yml up -d postgres
```

### หยุดการทำงาน

```bash
# หยุด containers (ข้อมูลยังอยู่)
docker-compose -f docker-compose.dev.yml stop

# หยุด และลบ containers (ข้อมูลยังอยู่ใน volume)
docker-compose -f docker-compose.dev.yml down

# หยุด และลบ containers + volumes (ลบข้อมูลทั้งหมด)
docker-compose -f docker-compose.dev.yml down -v
```

---

## 📊 ตรวจสอบสถานะ

### ดู Containers ที่ทำงานอยู่

```bash
# ดูสถานะ containers
docker-compose -f docker-compose.dev.yml ps

# Output ตัวอย่าง:
# NAME                      STATUS       PORTS
# expense-tracker-db-dev    healthy      0.0.0.0:5432->5432/tcp
# expense-tracker-api-dev   running      0.0.0.0:3000->3000/tcp
```

### ดู Logs

```bash
# ดู logs ทั้งหมด
docker-compose -f docker-compose.dev.yml logs

# ดู logs แบบ real-time (follow)
docker-compose -f docker-compose.dev.yml logs -f

# ดู logs เฉพาะ service
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f postgres

# ดู logs แค่ 20 บรรทัดล่าสุด
docker-compose -f docker-compose.dev.yml logs --tail=20 app

# ดู logs พร้อม timestamp
docker-compose -f docker-compose.dev.yml logs -f -t app
```

### ดูการใช้ Resources

```bash
# ดู CPU, Memory, Network usage
docker-compose -f docker-compose.dev.yml stats

# ดูแบบไม่มี stream (ครั้งเดียว)
docker-compose -f docker-compose.dev.yml stats --no-stream
```

---

## 🔥 Hot-Reload Development

### วิธีการทำงาน

เมื่อแก้ไขโค้ดในเครื่อง → Docker จะ compile ใหม่อัตโนมัติ

```bash
# 1. รัน dev mode
docker-compose -f docker-compose.dev.yml up -d

# 2. เปิด logs เพื่อดู hot-reload
docker-compose -f docker-compose.dev.yml logs -f app

# 3. แก้ไขโค้ด (เช่น src/app.controller.ts)

# 4. ดู logs - จะเห็น:
# [Nest] File change detected. Starting incremental compilation...
# [Nest] Successfully compiled: 1 file with swc (234ms)
# [Nest] Restarting Nest application...
```

### ไฟล์ที่ Hot-Reload รองรับ

**ใช้ได้ ✅:**
- `src/**/*.ts` - โค้ด TypeScript ทั้งหมด
- `prisma/schema.prisma` - Prisma schema (ต้อง migrate)

**ใช้ไม่ได้ ❌ (ต้อง rebuild):**
- `package.json` - dependencies ใหม่
- `Dockerfile.dev` - การเปลี่ยน Docker config
- `docker-compose.dev.yml` - การเปลี่ยน compose config

---

## 💻 เข้าไปใน Container

### เข้าไปรันคำสั่งใน Container

```bash
# เข้า shell ใน app container
docker-compose -f docker-compose.dev.yml exec app sh

# เข้า shell ใน database container
docker-compose -f docker-compose.dev.yml exec postgres sh
```

### รันคำสั่งโดยไม่ต้องเข้า shell

```bash
# รัน Prisma commands
docker-compose -f docker-compose.dev.yml exec app npx prisma studio
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev

# รัน yarn commands
docker-compose -f docker-compose.dev.yml exec app yarn add package-name
docker-compose -f docker-compose.dev.yml exec app yarn test

# ดู Node version
docker-compose -f docker-compose.dev.yml exec app node --version
```

---

## 🗄️ Database Management

### เชื่อมต่อ Database

**ข้อมูลการเชื่อมต่อ (TablePlus / DBeaver / pgAdmin):**
```
Host:     localhost
Port:     5432
Database: expense_db (หรือตามที่ตั้งใน .env)
User:     yongyut (หรือตามที่ตั้งใน .env)
Password: 334567 (หรือตามที่ตั้งใน .env)
```

### เข้าใช้ psql

```bash
# เข้า PostgreSQL shell
docker-compose -f docker-compose.dev.yml exec postgres psql -U yongyut -d expense_db

# รัน SQL query
docker-compose -f docker-compose.dev.yml exec postgres psql -U yongyut -d expense_db -c "SELECT * FROM \"User\";"

# ดู tables ทั้งหมด
docker-compose -f docker-compose.dev.yml exec postgres psql -U yongyut -d expense_db -c "\dt"
```

### Prisma Commands

```bash
# เปิด Prisma Studio (GUI)
docker-compose -f docker-compose.dev.yml exec app npx prisma studio
# จะเปิดที่ http://localhost:5555

# Run migration
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name migration_name

# Generate Prisma Client (หลังแก้ schema)
docker-compose -f docker-compose.dev.yml exec app npx prisma generate

# Reset database (ลบข้อมูลทั้งหมด)
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate reset
```

### Backup & Restore

```bash
# Backup database
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U yongyut expense_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U yongyut expense_db < backup_20260216_123000.sql

# Export to custom format (แนะนำ - เร็วกว่า)
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U yongyut -Fc expense_db > backup.dump

# Restore from custom format
docker-compose -f docker-compose.dev.yml exec -T postgres pg_restore -U yongyut -d expense_db < backup.dump
```

---

## 🔄 Restart & Rebuild

### Restart Services

```bash
# Restart ทั้งหมด
docker-compose -f docker-compose.dev.yml restart

# Restart เฉพาะ app
docker-compose -f docker-compose.dev.yml restart app

# Restart เฉพาะ database
docker-compose -f docker-compose.dev.yml restart postgres
```

### Rebuild Images

```bash
# Rebuild และรันใหม่
docker-compose -f docker-compose.dev.yml up -d --build

# Rebuild แบบ no-cache (ลบ cache ทั้งหมด)
docker-compose -f docker-compose.dev.yml build --no-cache

# Rebuild เฉพาะ service
docker-compose -f docker-compose.dev.yml build app
```

### เมื่อไหร่ต้อง Rebuild?

**ต้อง Rebuild เมื่อ:**
- ✅ เพิ่ม/ลบ dependencies ใน `package.json`
- ✅ แก้ไข `Dockerfile.dev`
- ✅ แก้ไข environment variables หลัก
- ✅ ติดตั้ง system packages

**ไม่ต้อง Rebuild เมื่อ:**
- ❌ แก้โค้ด TypeScript (hot-reload)
- ❌ แก้ Prisma schema (แค่ migrate)
- ❌ แก้ environment variables ใน `.env` (แค่ restart)

---

## 🧹 ทำความสะอาด

### ลบ Containers และ Volumes

```bash
# ลบ containers (ข้อมูลยังอยู่)
docker-compose -f docker-compose.dev.yml down

# ลบ containers + volumes (ลบข้อมูลทั้งหมด)
docker-compose -f docker-compose.dev.yml down -v

# ลบ containers + volumes + images
docker-compose -f docker-compose.dev.yml down -v --rmi all

# ลบ orphan containers
docker-compose -f docker-compose.dev.yml down --remove-orphans
```

### ลบ Docker Resources ทั้งหมด

```bash
# ดู Docker disk usage
docker system df

# ลบทุกอย่างที่ไม่ได้ใช้
docker system prune -a

# ลบ volumes ที่ไม่ได้ใช้
docker volume prune

# ลบ images ที่ไม่ได้ใช้
docker image prune -a
```

---

## 🔍 Debugging & Troubleshooting

### ตรวจสอบปัญหา

```bash
# ดู logs หา error
docker-compose -f docker-compose.dev.yml logs app | grep -i error

# ดู container health
docker-compose -f docker-compose.dev.yml ps
docker inspect expense-tracker-db-dev | grep -A 5 Health

# ตรวจสอบ network
docker-compose -f docker-compose.dev.yml exec app ping postgres

# ดู environment variables
docker-compose -f docker-compose.dev.yml exec app env
```

### ปัญหาที่พบบ่อย

**1. Port ถูกใช้แล้ว**
```bash
# หา process ที่ใช้ port 3000
lsof -i :3000

# หรือ port 5432
lsof -i :5432

# Kill process
kill -9 <PID>
```

**2. Database ไม่ healthy**
```bash
# Restart database
docker-compose -f docker-compose.dev.yml restart postgres

# ดู logs
docker-compose -f docker-compose.dev.yml logs postgres

# เข้าไปตรวจสอบ
docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U yongyut
```

**3. Hot-reload ไม่ทำงาน**
```bash
# Restart app container
docker-compose -f docker-compose.dev.yml restart app

# Rebuild
docker-compose -f docker-compose.dev.yml up -d --build app

# ตรวจสอบ volume mounting
docker inspect expense-tracker-api-dev | grep -A 20 Mounts
```

**4. Out of memory**
```bash
# เพิ่ม memory limit ใน docker-compose.dev.yml
services:
  app:
    mem_limit: 2g
    
# หรือปรับ Docker Desktop settings
```

---

## 📦 Package Management

### ติดตั้ง Package ใหม่

```bash
# ติดตั้ง package
docker-compose -f docker-compose.dev.yml exec app yarn add package-name

# ติดตั้ง dev dependency
docker-compose -f docker-compose.dev.yml exec app yarn add -D package-name

# ลบ package
docker-compose -f docker-compose.dev.yml exec app yarn remove package-name

# Update packages
docker-compose -f docker-compose.dev.yml exec app yarn upgrade
```

### หลังติดตั้ง Package

```bash
# Rebuild image (ถ้าต้องการให้ persistent)
docker-compose -f docker-compose.dev.yml build app
docker-compose -f docker-compose.dev.yml up -d
```

---

## 🧪 Testing

### รัน Tests ใน Docker

```bash
# รัน unit tests
docker-compose -f docker-compose.dev.yml exec app yarn test

# รัน tests แบบ watch mode
docker-compose -f docker-compose.dev.yml exec app yarn test:watch

# รัน e2e tests
docker-compose -f docker-compose.dev.yml exec app yarn test:e2e

# รัน test coverage
docker-compose -f docker-compose.dev.yml exec app yarn test:cov
```

---

## 🎯 Shortcuts & Aliases

เพิ่มใน `~/.zshrc` หรือ `~/.bashrc`:

```bash
# Docker Compose Dev shortcuts
alias dcdev='docker-compose -f docker-compose.dev.yml'
alias dcup='docker-compose -f docker-compose.dev.yml up -d'
alias dcdown='docker-compose -f docker-compose.dev.yml down'
alias dclogs='docker-compose -f docker-compose.dev.yml logs -f'
alias dcps='docker-compose -f docker-compose.dev.yml ps'
alias dcrestart='docker-compose -f docker-compose.dev.yml restart'
alias dcrebuild='docker-compose -f docker-compose.dev.yml up -d --build'

# Expense Tracker specific
alias etup='cd ~/Project/Personal/expense-tracker-api && docker-compose -f docker-compose.dev.yml up -d'
alias etlogs='cd ~/Project/Personal/expense-tracker-api && docker-compose -f docker-compose.dev.yml logs -f app'
alias etshell='cd ~/Project/Personal/expense-tracker-api && docker-compose -f docker-compose.dev.yml exec app sh'
alias etdb='cd ~/Project/Personal/expense-tracker-api && docker-compose -f docker-compose.dev.yml exec postgres psql -U yongyut -d expense_db'
```

หลังจากเพิ่ม reload shell:
```bash
source ~/.zshrc  # หรือ source ~/.bashrc
```

ใช้งาน:
```bash
dcup           # แทน docker-compose -f docker-compose.dev.yml up -d
dclogs         # แทน docker-compose -f docker-compose.dev.yml logs -f
etup           # รัน expense tracker
etlogs         # ดู logs
```

---

## 📝 Development Workflow ทั่วไป

### เริ่มวัน

```bash
# 1. รัน Docker
docker-compose -f docker-compose.dev.yml up -d

# 2. ดู logs เพื่อ verify
docker-compose -f docker-compose.dev.yml logs -f app

# 3. เปิด Prisma Studio (optional)
docker-compose -f docker-compose.dev.yml exec app npx prisma studio
```

### ระหว่างทำงาน

```bash
# แก้โค้ด → hot-reload อัตโนมัติ
# ดู logs เพื่อเช็ค compilation
docker-compose -f docker-compose.dev.yml logs -f app

# ถ้าติดปัญหา restart
docker-compose -f docker-compose.dev.yml restart app
```

### จบวัน

```bash
# หยุด containers (เก็บข้อมูล)
docker-compose -f docker-compose.dev.yml stop

# หรือ ลบ containers (เก็บข้อมูลไว้ใน volume)
docker-compose -f docker-compose.dev.yml down
```

---

## 🚀 Production Commands

### Build Production Image

```bash
# Build
docker-compose build

# Run production
docker-compose up -d

# ดู logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📚 อ้างอิง

- [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [NestJS CLI Reference](https://docs.nestjs.com/cli/overview)

---

**อัพเดทล่าสุด**: 16 กุมภาพันธ์ 2026
