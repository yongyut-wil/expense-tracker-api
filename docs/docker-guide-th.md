# 🐳 คู่มือ Docker สำหรับ Expense Tracker API

> คู่มือการใช้ Docker และ Docker Compose แบบละเอียด

## 📋 สารบัญ

- [ภาพรวม](#ภาพรวม)
- [ความต้องการ](#ความต้องการ)
- [Docker Compose Setup](#docker-compose-setup)
- [การใช้งาน](#การใช้งาน)
- [Configuration](#configuration)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 ภาพรวม

โปรเจคนี้ใช้ Docker สำหรับ:
- **PostgreSQL Database** - รัน database ใน container
- **API Application** (optional) - รัน NestJS app ใน container

### Architecture

```
┌─────────────────────────────────┐
│     Expense Tracker API         │
│      (Port 3000)                │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│    PostgreSQL Database          │
│      (Port 5432)                │
└─────────────────────────────────┘
```

---

## ✅ ความต้องการ

### ติดตั้ง Docker

#### macOS
```bash
# ใช้ Homebrew
brew install --cask docker

# หรือดาวน์โหลดจาก
# https://www.docker.com/products/docker-desktop
```

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# เพิ่ม user เข้า docker group
sudo usermod -aG docker $USER
```

#### Windows
```
ดาวน์โหลด Docker Desktop:
https://www.docker.com/products/docker-desktop
```

### ตรวจสอบการติดตั้ง

```bash
# ตรวจสอบ Docker version
docker --version
# Docker version 24.0.0, build ...

# ตรวจสอบ Docker Compose version
docker compose version
# Docker Compose version v2.20.0
```

---

## 🚀 Docker Compose Setup

### ไฟล์ docker-compose.yml

โปรเจคนี้มี `docker-compose.yml` ที่ตั้งค่าไว้แล้ว:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: expense-tracker-db
    restart: unless-stopped
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-expense_tracker}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - expense-tracker-network

  # API (optional - สามารถ uncomment เพื่อใช้งาน)
  # api:
  #   build:
  #     context: .
  #     dockerfile: Dockerfile
  #   container_name: expense-tracker-api
  #   restart: unless-stopped
  #   ports:
  #     - "3000:3000"
  #   environment:
  #     DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
  #     JWT_SECRET: ${JWT_SECRET}
  #   depends_on:
  #     - db
  #   networks:
  #     - expense-tracker-network

volumes:
  postgres_data:

networks:
  expense-tracker-network:
    driver: bridge
```

---

## 💻 การใช้งาน

### 1. รัน Database อย่างเดียว (แนะนำ)

```bash
# รัน PostgreSQL container
docker compose up -d db

# ตรวจสอบสถานะ
docker compose ps

# ผลลัพธ์:
# NAME                    STATUS    PORTS
# expense-tracker-db      Up        0.0.0.0:5432->5432/tcp
```

จากนั้น **รัน API ใน local**:

```bash
# ติดตั้ง dependencies
yarn install

# Run migrations
yarn prisma migrate deploy
yarn prisma generate

# รัน dev server
yarn start:dev
```

### 2. รันทั้ง Database + API ใน Docker

**แก้ไข `docker-compose.yml`**:
- Uncomment ส่วน `api` service

```bash
# Build และรัน
docker compose up -d --build

# ตรวจสอบ
docker compose ps

# ดู logs
docker compose logs -f
```

### 3. คำสั่งพื้นฐาน

```bash
# รัน services
docker compose up -d

# หยุด services
docker compose stop

# Stop และลบ containers
docker compose down

# Stop และลบทั้ง containers + volumes (ลบข้อมูล!)
docker compose down -v

# Restart services
docker compose restart

# Rebuild
docker compose up -d --build
```

---

## ⚙️ Configuration

### Environment Variables

สร้างไฟล์ `.env`:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=expense_tracker
POSTGRES_PORT=5432

# Application
DATABASE_URL="postgresql://postgres:your_secure_password@localhost:5432/expense_tracker"
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

### Custom Port

ถ้า port 5432 ถูกใช้แล้ว:

```env
# ใช้ port อื่น
POSTGRES_PORT=5433
DATABASE_URL="postgresql://postgres:password@localhost:5433/expense_tracker"
```

```bash
# รัน container ใหม่
docker compose down
docker compose up -d
```

---

## 🗄️ Database Management

### เข้าถึง PostgreSQL

#### วิธีที่ 1: ผ่าน Docker Exec

```bash
# เข้าสู่ psql
docker exec -it expense-tracker-db psql -U postgres -d expense_tracker

# คำสั่งใน psql:
\dt              # แสดงตาราง
\d users         # ดู schema
\l               # แสดง databases
\q               # ออก
```

#### วิธีที่ 2: ใช้ Prisma Studio

```bash
# เปิด Prisma Studio
yarn prisma studio

# เปิดที่ http://localhost:5555
```

#### วิธีที่ 3: ใช้ psql จาก Host

```bash
# ต้องติดตั้ง postgresql-client
brew install postgresql  # macOS
sudo apt install postgresql-client  # Linux

# เชื่อมต่อ
psql -h localhost -U postgres -d expense_tracker
```

### Backup & Restore

#### Backup Database

```bash
# Backup to SQL file
docker exec expense-tracker-db pg_dump -U postgres expense_tracker > backup_$(date +%Y%m%d).sql

# Backup with compression
docker exec expense-tracker-db pg_dump -U postgres expense_tracker | gzip > backup_$(date +%Y%m%d).sql.gz
```

#### Restore Database

```bash
# Restore from SQL file
docker exec -i expense-tracker-db psql -U postgres expense_tracker < backup.sql

# Restore from compressed file
gunzip < backup.sql.gz | docker exec -i expense-tracker-db psql -U postgres expense_tracker
```

### Reset Database

```bash
# วิธีที่ 1: ใช้ Prisma
yarn prisma migrate reset

# วิธีที่ 2: ลบและสร้างใหม่
docker compose down -v  # ลบ volume
docker compose up -d db
yarn prisma migrate deploy
```

---

## 🐛 Troubleshooting

### ปัญหา: Container ไม่ตื่น

```bash
# ดู logs
docker compose logs db

# ดู error message
docker compose logs db | tail -20
```

### ปัญหา: Port ถูกใช้แล้ว

```bash
# ดูว่าโปรแกรมไหนใช้ port 5432
lsof -i :5432

# แก้ไข: เปลี่ยน port ในไฟล์ .env
POSTGRES_PORT=5433
```

### ปัญหา: Cannot connect to database

```bash
# 1. ตรวจสอบว่า container รันอยู่
docker compose ps

# 2. ตรวจสอบ DATABASE_URL ในไฟล์ .env
echo $DATABASE_URL

# 3. Test connection
docker exec expense-tracker-db pg_isready -U postgres

# 4. Restart container
docker compose restart db
```

### ปัญหา: Database data หาย

```bash
# ตรวจสอบ volumes
docker volume ls | grep expense

# ดูข้อมูลใน volume
docker volume inspect expense-tracker-api_postgres_data

# ถ้า volume หาย = ต้อง restore จาก backup
```

### ปัญหา: Permission denied

```bash
# Fix permissions (Linux)
sudo chown -R $USER:$USER .

# ลบ volumes แล้วสร้างใหม่
docker compose down -v
docker compose up -d
```

---

## 💡 Best Practices

### 1. ใช้ .env สำหรับ Configuration

```bash
# ❌ ไม่ควร hard-code
docker run -e POSTGRES_PASSWORD=mypass postgres

# ✅ ควรใช้ .env
docker compose up -d
```

### 2. Backup ข้อมูลสม่ำเสมอ

```bash
# สร้าง cron job สำหรับ auto-backup
0 2 * * * /path/to/backup-script.sh
```

### 3. ใช้ Named Volumes

```yaml
# ✅ Named volume (ข้อมูลไม่หาย)
volumes:
  - postgres_data:/var/lib/postgresql/data

# ❌ Bind mount (อาจมีปัญหา permissions)
volumes:
  - ./data:/var/lib/postgresql/data
```

### 4. ตั้งค่า Resource Limits

```yaml
services:
  db:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          memory: 256M
```

### 5. ใช้ Health Checks

```yaml
services:
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

---

## 🔍 Monitoring

### ดู Resource Usage

```bash
# ดู CPU, Memory usage
docker stats expense-tracker-db

# ดูแบบ real-time
docker stats
```

### ดู Logs

```bash
# ดู logs ทั้งหมด
docker compose logs

# Follow logs
docker compose logs -f

# ดู logs 100 บรรทัดล่าสุด
docker compose logs --tail=100

# ดู logs ของ service เดียว
docker compose logs -f db
```

### ตรวจสอบ Health

```bash
# ตรวจสอบว่า PostgreSQL พร้อมใช้งาน
docker exec expense-tracker-db pg_isready -U postgres

# ดู PostgreSQL version
docker exec expense-tracker-db psql -U postgres -c "SELECT version();"

# ดูจำนวน connections
docker exec expense-tracker-db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## 📚 คำสั่งที่ใช้บ่อย

```bash
# Development
docker compose up -d db              # รัน database
docker compose logs -f               # ดู logs
docker compose restart db            # Restart database
yarn prisma studio                   # เปิด database GUI

# Backup
docker exec expense-tracker-db pg_dump -U postgres expense_tracker > backup.sql

# Restore  
docker exec -i expense-tracker-db psql -U postgres expense_tracker < backup.sql

# Clean up
docker compose down                  # หยุดและลบ containers
docker compose down -v               # + ลบ volumes (ลบข้อมูล!)
docker system prune -a              # ลบทุกอย่าง (ระวัง!)
```

---

## 🚢 Production Tips

### 1. ใช้ Docker Secrets

```yaml
services:
  db:
    secrets:
      - postgres_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
```

### 2. ใช้ Private Registry

```bash
# Tag image
docker tag expense-tracker-api registry.example.com/expense-tracker-api:1.0.0

# Push to registry
docker push registry.example.com/expense-tracker-api:1.0.0
```

### 3. Multi-stage Build

ดูได้ใน `Dockerfile` ของโปรเจค:
- Stage 1: Build dependencies
- Stage 2: Production runtime

---

**อัพเดทล่าสุด**: 16 February 2026
