# Technical Documentation: Transaction Intelligence System

เอกสารฉบับนี้รวบรวมรายละเอียดการออกแบบและการ実装 (Implementation) ระบบจัดหมวดหมู่อัตโนมัติ, การแปลภาษา (i18n), และระบบการเรียงลำดับที่มีความแม่นยำสูง

---

## 1. วัตถุประสงค์ (Objectives)
1. **Auto-categorization**: เดาหมวดหมู่จากชื่อรายการที่ผู้ใช้พิมพ์
2. **Title Translation (i18n)**: สร้างชื่อภาษาอังกฤษ (`titleEn`) อัตโนมัติเพื่อรองรับการสลับภาษาที่หน้าบ้าน
3. **Chronological Sorting**: เรียงลำดับรายการตามเวลาจริง แม้จะมีการแก้ไขวันที่
4. **Data Migration**: ปรับปรุงข้อมูลเก่าในระบบให้เป็นมาตรฐานใหม่

---

## 2. สถาปัตยกรรมระบบ (Architecture)

เราใช้วิธี **Hybrid Categorization Layer** เพื่อความเร็วและความแม่นยำ:

### A. Fast Layer (Keyword-based)
- **ไฟล์หลัก**: `KeywordCategorizationService`
- **การทำงาน**: ใช้การจับคู่คำ (String matching) กับคำศัพท์ที่พบบ่อย (เช่น "bts", "7-11", "grab")
- **ข้อดี**: ทำงานทันที (Latency ใกล้ศูนย์) และไม่เสียโควต้า AI

### B. Smart Layer (AI-based)
- **ไฟล์หลัก**: `AICategorizationService`
- **การทำงาน**: ใช้ Google Gemini 1.5 Flash ในการวิเคราะห์ประโยคที่ซับซ้อน (เช่น "ไปกินส้มตำปากซอย")
- **ผลลัพธ์**: AI จะตอบมาเป็น JSON ที่มีทั้ง `category` และ `titleEn`

---

## 3. รายละเอียดการ実装 (Implementation Details)

### 3.1 การเปลี่ยนแปลงทางข้อมูล (Database & Entity)
- **Prisma Schema**: เพิ่มฟิลด์ `titleEn String?` ใน `Transaction` model
- **Domain Entity**: อัปเดต `Transaction` class ให้รองรับฟิลด์ใหม่
- **Mappers**: ปรับปรุง `TransactionMapper` เพื่อแปลงข้อมูลระหว่าง Database และ API Response

### 3.2 Business Logic Updates
- **`CreateTransactionUseCase`**:
    - ตรวจสอบว่า `category` ที่ส่งมาเป็นค่าเริ่มต้นหรือไม่ (เช่น "Other", "Food & Dining") หากใช่ ระบบจะเรียก AI ให้เดาหมวดหมู่ใหม่ที่แม่นยำกว่า
    - หากเป็นวันที่ปัจจุบันแต่ไม่มีข้อมูลเวลา ระบบจะใช้ `now()` (เวลาปัจจุบัน) เพื่อให้เรียงลำดับตามจริง
- **`UpdateTransactionUseCase`**:
    - มีระบบ **Re-categorization trigger**: หากผู้ใช้แก้ไขชื่อรายการ (Title) หรือหากหมวดหมู่เดิมเป็นหมวดหมู่ทั่วไป ระบบจะทำการสแกนหมวดหมู่ใหม่โดยอัตโนมัติ

### 3.3 การจัดการโควต้า AI (Quota Management)
- **โมเดลที่เลือก**: เปลี่ยนจาก `gemini-flash-latest` เป็น `gemini-1.5-flash` แบบคงที่ (Static) เพื่อหลีกเลี่ยงข้อจำกัดโควต้าต่ำ (20 requests/day) ในรุ่นทดลอง (Experimental) และได้โควต้าโหมดฟรีสูงสุด (1,500 requests/day)

---

## 4. ระบบการเรียงลำดับ (Smart Sorting)
- **ปัญหาเดิม**: หากบันทึกรายการหลายอย่างในวันเดียวกัน ลำดับอาจสลับไปมาตาม ID
- **วิธีแก้**:
    1. **Time Precision**: บันทึกเวลาที่ระดับวินาที (Second precision) ลงในฟิลด์ `date` 
    2. **Repository Sorting**: ปรับปรุงคำสั่ง SQL (Prisma) ให้เรียกข้อมูลโดยเรียงลำดับตาม `date DESC` (รวมเวลา) และใช้ `id DESC` เป็นตัวตัดสิน (Tie-breaker)

---

## 5. การ Migrate ข้อมูล (Batch Processing)
- **สคริปต์**: `scripts/migrate-transactions.ts`
- **เทคนิคที่ใช้**: **Batching (ทีละ 10 รายการ)**
    - ส่งข้อมูลหลายรายการไปให้ AI วิเคราะห์ในครั้งเดียว เพื่อประหยัดโควต้า (RPM/RPD) 
    - มีระบบ **Exponential Backoff**: หากติด Error 429 (Too Many Requests) สคริปต์จะรอ 60 วินาทีและพยายามใหม่โดยอัตโนมัติ

---

## 6. วิธีดูแลรักษาและขยายผล (Maintenance)

### การเพิ่ม Keyword ใหม่
ไปที่ `src/application/services/keyword-categorization.service.ts` และเพิ่มคำใน `keywordMap`
```typescript
{ keywords: ['mrt', 'bts', 'grab'], category: 'Transportation' }
```

### การเปลี่ยนรุ่น AI
ไปที่ `src/application/services/ai-categorization.service.ts` ใน Constructor:
```typescript
this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
```

---
*เอกสารฉบับนี้สรุปความคืบหน้าและการเปลี่ยนแปลงทั้งหมด ณ วันที่ 14 มีนาคม 2026*
