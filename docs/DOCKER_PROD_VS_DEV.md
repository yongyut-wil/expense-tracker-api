# 🐳 Docker: Production vs Development

> อธิบายความแตกต่างระหว่าง Production และ Development Docker setup

---

## 📋 สารบัญ

- [คำสั่งหลัก](#คำสั่งหลัก)
- [เปรียบเทียบ](#เปรียบเทียบ)
- [ไฟล์ที่เกี่ยวข้อง](#ไฟล์ที่เกี่ยวข้อง)
- [ตัวอย่างการใช้งาน](#ตัวอย่างการใช้งาน)
- [เมื่อไหร่ใช้อะไร](#เมื่อไหร่ใช้อะไร)
- [Best Practices](#best-practices)

---

## 🎯 คำสั่งหลัก

### Production Mode

```bash
docker compose up -d
```

- ใช้ไฟล์: `docker-compose.yml` (default)
- Dockerfile: `Dockerfile` (multi-stage)
- **ไม่มี** hot-reload
- **Optimized** for production

### Development Mode

```bash
docker-compose -f docker-compose.dev.yml up -d
```

- ใช้ไฟล์: `docker-compose.dev.yml` (ระบุเอง)
- Dockerfile: `Dockerfile.dev` (single-stage)
- **มี** hot-reload
- **Optimized** for development

---

## 📊 เปรียบเทียบแบบละเอียด

| Feature | Production | Development |
|---------|-----------|-------------|
| **คำสั่ง** | `docker compose up -d` | `docker-compose -f docker-compose.dev.yml up -d` |
| **Compose File** | `docker-compose.yml` | `docker-compose.dev.yml` |
| **Dockerfile** | `Dockerfile` | `Dockerfile.dev` |
| **Build Strategy** | Multi-stage (2 stages) | Single-stage |
| **Image Size** | ~180 MB ⚡ | ~450 MB |
| **Dependencies** | Production only | All (prod + dev) |
| **Hot-reload** | ❌ ไม่มี | ✅ มี |
| **Volume Mounting** | ❌ ไม่มี | ✅ มี (`./src`, `./prisma`) |
| **แก้โค้ด** | ต้อง rebuild image | เห็นผลทันที (2-3 วินาที) |
| **Build Time** | ~45 วินาที | ~30 วินาที |
| **Rebuild Time** | ~40 วินาที | ไม่ต้อง rebuild! |
| **Security** | ✅ Optimized | ⚠️ Dev tools included |
| **Use Case** | Production, Staging | Development, Local |

---

## 📁 ไฟล์ที่เกี่ยวข้อง

### Production Files

#### `docker-compose.yml`
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DATABASE_USER:-postgres}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD:-postgres}
      POSTGRES_DB: ${DATABASE_NAME:-expense_tracker}
    # No volume mounting for source code
  
  app:
    build:
      context: .
      dockerfile: Dockerfile  # ← Multi-stage production
    # No volume mounting
    command: sh -c "npx prisma migrate deploy && node dist/main"
```

#### `Dockerfile` (Multi-stage)
```dockerfile
# Stage 1: Builder
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN yarn build

# Stage 2: Production (เล็กกว่า!)
FROM node:24-alpine AS production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# ... rest of config
```

**ข้อดี**:
- ✅ Image ขนาดเล็ก (~180 MB)
- ✅ ไม่มี dev dependencies
- ✅ Secure (minimize attack surface)
- ✅ Production-ready

**ข้อเสีย**:
- ❌ แก้โค้ดต้อง rebuild
- ❌ Build ช้ากว่า
- ❌ ไม่เหมาะสำหรับ development

---

### Development Files

#### `docker-compose.dev.yml`
```yaml
services:
  postgres:
    image: postgres:16-alpine
    # Same as production
  
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev  # ← Development single-stage
    volumes:
      - ./src:/app/src           # ← Hot-reload!
      - ./prisma:/app/prisma     # ← Schema changes
      - /app/node_modules        # ← Prevent overwrite
    command: sh -c "npx prisma migrate dev && yarn start:dev"
```

#### `Dockerfile.dev` (Single-stage)
```dockerfile
FROM node:22-alpine AS development
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install  # ← All dependencies (dev + prod)
COPY . .
RUN npx prisma generate
CMD ["yarn", "start:dev"]  # ← Watch mode
```

**ข้อดี**:
- ✅ Hot-reload (แก้โค้ดเห็นทันที)
- ✅ Volume mounting
- ✅ ไม่ต้อง rebuild
- ✅ Dev tools ครบ

**ข้อเสีย**:
- ❌ Image ใหญ่กว่า (~450 MB)
- ❌ มี dev dependencies
- ❌ ไม่เหมาะสำหรับ production

---

## 🎬 ตัวอย่างการใช้งาน

### Scenario 1: Development ทั่วไป

**สถานการณ์**: ทำงานพัฒนา feature ใหม่

```bash
# 1. เริ่มต้นวัน
docker-compose -f docker-compose.dev.yml up -d

# 2. ดู logs
docker-compose -f docker-compose.dev.yml logs -f app

# 3. แก้โค้ด (เช่น src/app.controller.ts)
# → Hot-reload อัตโนมัติ!
# → เห็นผลภายใน 2-3 วินาที

# 4. ถ้าเพิ่ม package ใหม่
docker-compose -f docker-compose.dev.yml exec app yarn add new-package

# 5. จบวัน
docker-compose -f docker-compose.dev.yml down
```

---

### Scenario 2: Test Production Build ก่อน Deploy

**สถานการณ์**: ต้องการทดสอบ production build ก่อน deploy จริง

```bash
# 1. Build production image
docker compose build --no-cache

# 2. รัน production mode
docker compose up -d

# 3. Test API
curl http://localhost:3000/api

# 4. Test endpoints
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 5. ถ้าทุกอย่างโอเค
docker compose down

# 6. Deploy to production server!
```

---

### Scenario 3: แก้โค้ดและต้องการ rebuild

**Development**: ไม่ต้อง rebuild!
```bash
# แก้โค้ด → บันทึก → hot-reload อัตโนมัติ ✨
# ไม่ต้องทำอะไรเพิ่ม!
```

**Production**: ต้อง rebuild
```bash
# แก้โค้ด → ต้อง rebuild
docker compose build
docker compose up -d
```

---

### Scenario 4: เปลี่ยน Dependencies

**Development**:
```bash
# ติดตั้งใน container
docker-compose -f docker-compose.dev.yml exec app yarn add lodash

# ถ้าต้องการให้ persistent → rebuild
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
```

**Production**:
```bash
# แก้ package.json → rebuild ทุกครั้ง
docker compose build --no-cache
docker compose up -d
```

---

## 🎯 เมื่อไหร่ใช้อะไร

### ใช้ Development Mode เมื่อ:

✅ **กำลังพัฒนา feature ใหม่**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

✅ **ต้องการ hot-reload** (แก้โค้ดเห็นทันที)

✅ **ทำงานในเครื่องของตัวเอง** (local development)

✅ **Debug และทดสอบระหว่างพัฒนา**

✅ **แก้โค้ดบ่อย ๆ** (ไม่อยากรอ rebuild)

---

### ใช้ Production Mode เมื่อ:

✅ **ทดสอบ production build** ก่อน deploy
```bash
docker compose up -d
```

✅ **Deploy จริงบน server**

✅ **ต้องการ optimize image size**

✅ **ต้องการ security ที่ดีกว่า**

✅ **Staging environment**

---

## ⚠️ ข้อควรระวัง

### ❌ อย่าใช้ Development Mode ใน Production!

**ห้ามทำ**:
```bash
# ❌ บน production server
docker-compose -f docker-compose.dev.yml up -d
```

**เพราะ**:
- ❌ Image ใหญ่กว่า (มี dev tools)
- ❌ มี dependencies ที่ไม่จำเป็น
- ❌ ไม่ได้ optimize
- ❌ Security risk (dev tools มักมีช่องโหว่)
- ❌ Performance ไม่ดีเท่า production build

---

### ✅ Best Practices

#### Development
```bash
# ใช้ alias เพื่อความสะดวก
alias dcdev='docker-compose -f docker-compose.dev.yml'
alias dcup-dev='dcdev up -d'
alias dclogs-dev='dcdev logs -f app'
alias dcdown-dev='dcdev down'

# ใช้งาน
dcup-dev
dclogs-dev
```

#### Production
```bash
# ใช้ alias
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dclogs='docker compose logs -f'

# ใช้งาน
dcup
dclogs
```

---

## 🔄 Workflow แนะนำ

### Development Workflow

```bash
# เช้า - เริ่มงาน
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f app

# ทำงาน - แก้โค้ด
# → hot-reload ทำงานอัตโนมัติ
# → ไม่ต้องรัน rebuild!

# เที่ยง - พักรับประทานอาหาร
docker-compose -f docker-compose.dev.yml stop

# เลิกงาน
docker-compose -f docker-compose.dev.yml down
```

---

### Production Testing Workflow

```bash
# ก่อน deploy - ทดสอบ production build
docker compose build --no-cache
docker compose up -d

# Test
curl http://localhost:3000/api
# ... run tests ...

# ถ้า OK
docker compose down

# Deploy to production
ssh production-server
git pull
docker compose build
docker compose up -d
```

---

## 📈 Performance Comparison

### Build Time

| Stage | Production | Development |
|-------|-----------|-------------|
| **Cold Build** | ~45s | ~30s |
| **Warm Build** (cached) | ~5s | ~3s |
| **Rebuild (แก้โค้ด)** | ~40s | ไม่ต้อง rebuild! ✨ |
| **Hot-reload** | ❌ N/A | ✅ 2-3 วินาที |

### Image Size

| Build Type | Size | Optimization |
|-----------|------|--------------|
| **Production** | ~180 MB | 60% reduction |
| **Development** | ~450 MB | No optimization |
| **Without Multi-stage** | ~450 MB | Baseline |

---

## 🎓 Key Takeaways

### Development Mode
- 🔥 Hot-reload = productivity boost
- 📂 Volume mounting = instant feedback
- 🚀 Fast iteration cycle
- 💻 Perfect for daily work

### Production Mode
- ⚡ Optimized image size
- 🔒 Better security
- 🎯 Production-ready
- 📦 Minimal attack surface

---

## 🔗 Related Documentation

- [Docker Dev Commands](./DOCKER_DEV_COMMANDS.md) - คำสั่งทั้งหมดสำหรับ development
- [Docker Guide (TH)](./docker-guide-th.md) - คู่มือ Docker แบบละเอียด
- [Commands Guide (TH)](./commands-guide-th.md) - รวมคำสั่งทั้งหมด

---

## 💡 Quick Reference Card

### Development
```bash
# Start
docker-compose -f docker-compose.dev.yml up -d

# Logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
# Build
docker compose build

# Start
docker compose up -d

# Logs  
docker compose logs -f

# Stop
docker compose down
```

---

**สรุป**: Development mode ใช้สำหรับทำงานประจำวัน (hot-reload, volume mounting), Production mode ใช้สำหรับ deploy จริง (optimized, secure)

**อัพเดทล่าสุด**: 16 กุมภาพันธ์ 2026
