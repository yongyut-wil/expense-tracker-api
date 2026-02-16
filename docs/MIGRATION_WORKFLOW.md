# 🔄 Migration Workflow: Dev → Production

> คู่มือการจัดการ Database Migrations เมื่อสลับระหว่าง Development และ Production

---

## 📋 ภาพรวม

**สถานการณ์ทั่วไป**:
1. พัฒนา feature ใหม่ใน **Development** mode
2. สร้าง migration ใหม่
3. ทดสอบให้เรียบร้อย
4. Deploy ไป **Production**

---

## 🎯 วิธีการทำงาน

### Development Mode
```bash
docker-compose -f docker-compose.dev.yml up -d
```
- ✅ รัน `prisma migrate dev` **อัตโนมัติ**
- ✅ สร้าง migration ใหม่ได้
- ✅ Apply migrations ทันที
- ✅ Hot-reload

### Production Mode
```bash
docker compose up -d
```
- ✅ **ไม่รัน** migration อัตโนมัติ
- ✅ รัน app เลย (`node dist/main`)
- ✅ ต้องรัน migration **แยกต่างหาก**
- ✅ ปลอดภัยกว่า (ไม่เสี่ยง auto-migration)

---

## 🔄 Workflow: Dev → Production

### Step 1: พัฒนาใน Development

```bash
# 1. รัน dev mode
docker-compose -f docker-compose.dev.yml up -d

# 2. แก้โค้ด, เพิ่ม model ใหม่ใน schema.prisma
# ตัวอย่าง: เพิ่ม field ใหม่
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
  name     String?  // ← เพิ่ม field ใหม่
}

# 3. สร้าง migration (ใน container)
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name add_user_name

# Output:
# Prisma schema loaded from prisma/schema.prisma.
# ...
# Migration `20260216_add_user_name` was created
# Your database is now in sync with your schema.
```

### Step 2: ทดสอบใน Development

```bash
# 1. ทดสอบ API
curl http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User"}'

# 2. เช็คว่าทุกอย่างทำงาน
docker-compose -f docker-compose.dev.yml logs -f app

# 3. ถ้าโอเค commit migration
git add prisma/migrations
git commit -m "Add user name field"
git push
```

### Step 3: Deploy ไป Production

```bash
# 1. หยุด development
docker-compose -f docker-compose.dev.yml down

# 2. Pull code ล่าสุด (มี migration ใหม่)
git pull

# 3. Build production image
docker compose build --no-cache

# 4. รัน production containers (ยังไม่มี migration)
docker compose up -d

# 5. ตรวจสอบว่า containers รันอยู่
docker compose ps
# NAME                  STATUS
# expense-tracker-db    Up (healthy)
# expense-tracker-api   Up

# 6. รัน migration แบบ manual (SAFE!)
docker compose exec app npx prisma migrate deploy

# Output:
# Loaded Prisma config from prisma.config.ts
# Prisma schema loaded from prisma/schema.prisma
# 
# Applying migration `20260216_add_user_name`
# 
# The following migration(s) have been applied:
# migrations/
#   └─ 20260216_add_user_name/
#     └─ migration.sql
# 
# Your database is now in sync with your schema.

# 7. ทดสอบ production
curl http://localhost:3000/api
```

---

## 🎯 สถานการณ์ต่าง ๆ

### Scenario 1: Migration ใหม่หลังจาก Deploy แล้ว

**สถานการณ์**: Production รันอยู่แล้ว แต่มี migration ใหม่จาก development

```bash
# 1. ใน dev - สร้าง migration
docker-compose -f docker-compose.dev.yml exec app \
  npx prisma migrate dev --name add_new_feature

# 2. ทดสอบใน dev ให้เรียบร้อย

# 3. Commit และ push
git add prisma/migrations
git commit -m "Add new feature migration"
git push

# 4. บน production server
git pull

# 5. Rebuild image (ถ้ามีการเปลี่ยน code)
docker compose build

# 6. Restart containers
docker compose down
docker compose up -d

# 7. รัน migration
docker compose exec app npx prisma migrate deploy
```

---

### Scenario 2: Rollback Migration

**สถานการณ์**: Migration มีปัญหา ต้อง rollback

```bash
# ⚠️ Prisma ไม่มี rollback built-in ต้องทำเอง!

# Option 1: Restore database จาก backup
docker compose exec postgres pg_restore -U yongyut -d expense_db < backup.dump

# Option 2: สร้าง migration ใหม่ที่ revert การเปลี่ยนแปลง
# เช่น ถ้าเพิ่ม column ให้สร้าง migration ที่ลบ column

# Option 3: Reset database (ถ้าเป็น dev/staging)
docker compose exec app npx prisma migrate reset
```

---

### Scenario 3: Fresh Database Setup

**สถานการณ์**: ต้องการสร้าง database ใหม่ทั้งหมด

```bash
# 1. ลบ volume เก่า
docker compose down -v

# 2. รัน containers ใหม่
docker compose up -d

# 3. รัน migrations ทั้งหมด
docker compose exec app npx prisma migrate deploy

# 4. (Optional) Seed data
docker compose exec app npx prisma db seed
```

---

### Scenario 4: Check Migration Status

**สถานการณ์**: อยากรู้ว่า migrations ไหนรันแล้ว ไหนยัง

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate status

# Production
docker compose exec app npx prisma migrate status

# Output จะบอกว่า:
# - migrations ไหน applied แล้ว
# - migrations ไหน pending
# - database schema sync กับ Prisma schema หรือไม่
```

---

## 🎨 Visual Flow

### Development Workflow
```
┌─────────────────────────────────────┐
│   Development Environment           │
│                                     │
│  1. Up container                    │
│     docker-compose -f              │
│     docker-compose.dev.yml up -d    │
│                                     │
│  2. Auto-run migrations ✨          │
│     (ทำอัตโนมัติ)                   │
│                                     │
│  3. แก้โค้ด + hot-reload           │
│                                     │
│  4. สร้าง migration ใหม่           │
│     prisma migrate dev              │
│                                     │
│  5. ทดสอบ                           │
└─────────────────────────────────────┘
```

### Production Workflow
```
┌─────────────────────────────────────┐
│   Production Environment            │
│                                     │
│  1. Build image                     │
│     docker compose build            │
│                                     │
│  2. Up containers                   │
│     docker compose up -d            │
│     (ยังไม่มี migration!)           │
│                                     │
│  3. รัน migration แบบ manual 🔒    │
│     docker compose exec app         │
│     npx prisma migrate deploy       │
│                                     │
│  4. ตรวจสอบ                         │
│     docker compose ps               │
│     curl http://localhost:3000/api  │
└─────────────────────────────────────┘
```

---

## ⚠️ Best Practices

### ✅ DO (ควรทำ)

1. **ทดสอบ migration ใน dev ก่อนเสมอ**
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev
   ```

2. **Backup database ก่อนรัน migration ใน production**
   ```bash
   docker compose exec postgres pg_dump -U yongyut expense_db > backup_$(date +%Y%m%d).sql
   ```

3. **ตรวจสอบ migration status ก่อน deploy**
   ```bash
   docker compose exec app npx prisma migrate status
   ```

4. **ใช้ descriptive migration names**
   ```bash
   npx prisma migrate dev --name add_user_profile_fields
   # ❌ ไม่ดี: migration_1, update_schema
   # ✅ ดี: add_user_name, create_posts_table
   ```

5. **Commit migrations ทันที**
   ```bash
   git add prisma/migrations
   git commit -m "feat: add user profile fields"
   ```

---

### ❌ DON'T (ไม่ควรทำ)

1. **อย่ารัน `prisma migrate dev` ใน production**
   ```bash
   # ❌ อันตราย!
   docker compose exec app npx prisma migrate dev
   ```

2. **อย่าแก้ไข migration ที่รันไปแล้ว**
   ```bash
   # ❌ อย่าทำ!
   # การแก้ไข migrations/ ที่ apply แล้วจะทำให้ checksum ไม่ตรง
   ```

3. **อย่า deploy โดยไม่ทดสอบ migration**
   ```bash
   # ❌ อย่า push code ที่ยังไม่ได้ test migration!
   ```

4. **อย่าใช้ `prisma db push` ใน production**
   ```bash
   # ❌ db push ไม่สร้าง migration history
   # ใช้แค่ใน prototyping เท่านั้น!
   ```

---

## 🔧 Troubleshooting

### ปัญหา: Prisma 7 - "datasource.url property is required"

**Error Message**:
```
Error: The datasource.url property is required in your Prisma config file 
when using prisma migrate deploy.
```

**สาเหตุ**: Prisma 7 ใช้ `prisma.config.ts` แทน `datasource.url` ใน schema.prisma แต่ `prisma migrate deploy` ยังต้องการ `url` property

**วิธีแก้ไข 3 ทาง**:

#### วิธีที่ 1: ใช้ Development Mode แทน (แนะนำสำหรับ Local!) ⭐

```bash
# หยุด production
docker compose down

# ใช้ dev mode (มี auto-migration, hot-reload)
docker-compose -f docker-compose.dev.yml up -d

# ตรวจสอบ
docker-compose -f docker-compose.dev.yml logs -f app
curl http://localhost:3000/api
```

**ข้อดี**:
- ✅ Migration รันอัตโนมัติ
- ✅ Hot-reload (แก้โค้ดเห็นทันที)
- ✅ ไม่ต้องรัน manual migration
- ✅ เหมาะสำหรับการพัฒนา

**ข้อเสีย**:
- ❌ Image ใหญ่กว่า (~450 MB)
- ❌ ไม่เหมาะสำหรับ production server

---

#### วิธีที่ 2: Skip Migration ใน Production

Production mode ไม่รัน migration - ใช้ database ที่ migrate แล้วจาก development:

```bash
# 1. Migrate ผ่าน dev mode ก่อน
docker-compose -f docker-compose.dev.yml up -d
# Database จะถูก migrate อัตโนมัติ

# 2. หยุด dev mode
docker-compose -f docker-compose.dev.yml down

# 3. รัน production (ข้าม migration)
docker compose up -d
# App จะรันกับ database ที่ migrate แล้ว
```

**เหมาะกับ**:
- ✅ Local development ที่ต้องการทดสอบ production build
- ✅ Shared database ระหว่าง dev และ prod
- ✅ ไม่ต้องการ hot-reload

**ข้อควรระวัง**:
- ⚠️ Database ต้อง migrate ก่อนด้วย dev mode
- ⚠️ ถ้ามี migration ใหม่ ต้องรัน dev mode ก่อนเสมอ

---

#### วิธีที่ 3: ใช้ Prisma Client แทน Migrate Deploy

สำหรับ production server จริง - ใช้ Prisma Client ที่ generate ไว้แล้ว:

```bash
# Production ไม่ต้องรัน migration
# แค่รัน app ที่ build พร้อม Prisma Client แล้ว
docker compose up -d

# Migration ควรทำก่อน deploy (CI/CD หรือ manual)
```

**Best Practice สำหรับ Production**:
1. Migrate database แยกต่างหาก (ก่อน deploy app)
2. Build Docker image พร้อม Prisma Client
3. Deploy app (ไม่รัน migration)

---

### แนวทางแนะนำตาม Use Case

#### Local Development (ทำงานประจำวัน)
```bash
# ใช้ dev mode
docker-compose -f docker-compose.dev.yml up -d
```
- Auto-migration ✅
- Hot-reload ✅
- ไม่ต้องคิดเรื่อง migration ✅

---

#### Test Production Build (ทดสอบก่อน deploy)
```bash
# 1. Migrate ผ่าน dev mode
docker-compose -f docker-compose.dev.yml up -d

# 2. สลับเป็น production
docker-compose -f docker-compose.dev.yml down
docker compose build
docker compose up -d
```

---

#### Production Server (Deploy จริง)
```bash
# 1. Migrate แยกต่างหาก (ก่อน deploy)
# Run migration script on staging/production database

# 2. Deploy app
docker compose build
docker compose up -d
```

---

### ปัญหา: Migration Failed

```bash
# ดู logs
docker compose logs app

# ดู status
docker compose exec app npx prisma migrate status

# Mark migration as applied (ถ้า manual fix แล้ว)
docker compose exec app npx prisma migrate resolve --applied "migration_name"

# Mark migration as rolled back
docker compose exec app npx prisma migrate resolve --rolled-back "migration_name"
```

### ปัญหา: Database out of sync

```bash
# ดู logs
docker compose logs app

# ดู status
docker compose exec app npx prisma migrate status

# Mark migration as applied (ถ้า manual fix แล้ว)
docker compose exec app npx prisma migrate resolve --applied "migration_name"

# Mark migration as rolled back
docker compose exec app npx prisma migrate resolve --rolled-back "migration_name"
```

### ปัญหา: Database out of sync

```bash
# ดูความแตกต่าง
docker compose exec app npx prisma migrate status

# แก้ไข - วิธีที่ 1: รัน pending migrations
docker compose exec app npx prisma migrate deploy

# แก้ไข - วิธีที่ 2: Reset (dev/staging only!)
docker compose exec app npx prisma migrate reset
```

---

## 📊 Comparison Table

| Feature | Development | Production |
|---------|------------|-----------|
| **Auto-migration** | ✅ Yes | ❌ No |
| **Command** | `prisma migrate dev` | `prisma migrate deploy` |
| **When to run** | อัตโนมัติ on startup | Manual after deployment |
| **Creates migrations** | ✅ Yes | ❌ No (uses existing) |
| **Safety** | ⚠️ Lower (auto) | ✅ Higher (manual review) |
| **Speed** | ⚡ Fast | 🐌 Slower (manual) |
| **Best for** | Local development | Production servers |

---

## 💡 Quick Reference

### Development
```bash
# Start
docker-compose -f docker-compose.dev.yml up -d

# Create migration
docker-compose -f docker-compose.dev.yml exec app \
  npx prisma migrate dev --name description

# Check status
docker-compose -f docker-compose.dev.yml exec app \
  npx prisma migrate status
```

### Production
```bash
# Start (no auto-migration)
docker compose up -d

# Run migrations manually
docker compose exec app npx prisma migrate deploy

# Check status
docker compose exec app npx prisma migrate status

# Backup first!
docker compose exec postgres pg_dump -U yongyut expense_db > backup.sql
```

---

## 🎓 Key Takeaways

1. **Development**: migrations รันอัตโนมัติ ✨
2. **Production**: migrations รัน manual เพื่อความปลอดภัย 🔒
3. **Always backup** ก่อนรัน migration ใน production 💾
4. **Test in dev first** ก่อน deploy ไป production 🧪
5. **Commit migrations** ทันทีหลังสร้าง 📝

---

**อัพเดทล่าสุด**: 16 กุมภาพันธ์ 2026
