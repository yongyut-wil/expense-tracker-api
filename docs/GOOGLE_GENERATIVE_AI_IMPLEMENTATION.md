# Google Generative AI Implementation Guide
## คู่มือการใช้งาน Google Generative AI

## Overview / ภาพรวม

This guide provides detailed instructions for implementing Google Generative AI (Gemini) in the Expense Tracker API project. The implementation focuses on AI-powered transaction categorization and title translation.

คู่มือนี้ให้คำแนะนำโดยละเอียดเกี่ยวกับการ implement Google Generative AI (Gemini) ในโปรเจค Expense Tracker API โดยเน้นการใช้ AI ในการจัดหมวดหมู่ธุรกรรมและแปลชื่อธุรกรรม

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Implementation Details](#implementation-details)
5. [Service Architecture](#service-architecture)
6. [Usage Examples](#usage-examples)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Advanced Features](#advanced-features)

## Prerequisites / ข้อกำหนดเบื้องต้น

Before implementing Google Generative AI, ensure you have:

ก่อนที่จะ implement Google Generative AI ให้แน่ใจว่าคุณมีสิ่งต่อไปนี้:

- **Node.js 18+** installed / ติดตั้ง Node.js 18+ แล้ว
- **Google Cloud Project** with Generative AI API enabled / มี Google Cloud Project ที่เปิดใช้งาน Generative AI API
- **API Key** from Google AI Studio / มี API Key จาก Google AI Studio
- **Basic understanding** of NestJS framework / มีความเข้าใจพื้นฐานเกี่ยวกับ NestJS framework
- **Expense Tracker API** project set up / มีโปรเจค Expense Tracker API ที่ติดตั้งแล้ว

### Getting Google API Key / การขอ API Key จาก Google

1. Visit [Google AI Studio](https://aistudio.google.com/) / เข้าไปที่ Google AI Studio
2. Sign in with your Google account / ล็อกอินด้วย Google account
3. Click "Get API Key" or navigate to API keys section / คลิก "Get API Key" หรือไปที่ส่วน API keys
4. Create a new API key / สร้าง API Key ใหม่
5. Copy the API key for configuration / คัดลอก API Key สำหรับการตั้งค่า

## Installation / การติดตั้ง

### Step 1: Install Google Generative AI Package / ขั้นตอนที่ 1: ติดตั้ง Google Generative AI Package

```bash
# Using npm
npm install @google/generative-ai

# Using yarn
yarn add @google/generative-ai
```

### Step 2: Verify Installation / ขั้นตอนที่ 2: ตรวจสอบการติดตั้ง

Check your `package.json` to ensure the dependency is added:

ตรวจสอบ `package.json` ของคุณเพื่อให้แน่ใจว่ามี dependency เพิ่มเข้ามา:

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    // ... other dependencies
  }
}
```

## Configuration / การตั้งค่า

### Step 1: Environment Variables / ขั้นตอนที่ 1: ตั้งค่า Environment Variables

Add the following to your `.env` file:

เพิ่มข้อมูลต่อไปนี้ในไฟล์ `.env` ของคุณ:

```env
# AI Categorization (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Step 2: Update .env.example / ขั้นตอนที่ 2: อัปเดต .env.example

Ensure your `.env.example` includes the new variable:

ให้แน่ใจว่า `.env.example` ของคุณมีตัวแปรใหม่นี้:

```env
# AI Categorization (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Step 3: Configuration Validation / ขั้นตอนที่ 3: การตรวจสอบการตั้งค่า

The API key should be automatically loaded by NestJS's `ConfigService` since we use `isGlobal: true` in the root module.

API key ควรถูกโหลดโดยอัตโนมัติผ่าน `ConfigService` ของ NestJS เนื่องจากเราใช้ `isGlobal: true` ใน root module

## Implementation Details / รายละเอียดการ Implement

### Core Service Structure / โครงสร้างหลักของ Service

The AI implementation is centered around the `AICategorizationService` located at:
`src/application/services/ai-categorization.service.ts`

การ implement AI มีศูนย์กลางอยู่ที่ `AICategorizationService` ซึ่งอยู่ที่:
`src/application/services/ai-categorization.service.ts`

### Service Breakdown / การแบ่งส่วนของ Service

```typescript
@Injectable()
export class AICategorizationService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    // Initialization logic / ตรรกะการเริ่มต้น
  }

  async categorize(title: string): Promise<{ category: string; titleEn: string } | null> {
    // AI categorization logic / ตรรกะการจัดหมวดหมู่ด้วย AI
  }
}
```

### Key Components / ส่วนประกอบหลัก

1. **Initialization** / การเริ่มต้น: Sets up Google Generative AI client with API key / ตั้งค่า Google Generative AI client ด้วย API key
2. **Model Selection** / การเลือก Model: Uses `gemini-flash-latest` for optimal performance / ใช้ `gemini-flash-latest` สำหรับประสิทธิภาพสูงสุด
3. **Prompt Engineering** / การออกแบบ Prompt: Structured prompts for consistent categorization / ออกแบบ prompts ที่มีโครงสร้างสำหรับการจัดหมวดหมู่ที่สม่ำเสมอ
4. **Error Handling** / การจัดการข้อผิดพลาด: Graceful fallbacks for API failures / มี fallback ที่สวยงามเมื่อ API ล้มเหลว
5. **Response Parsing** / การแปลง Response: JSON extraction and validation / การดึงและตรวจสอบ JSON

## Service Architecture / สถาปัตยกรรม Service

### Directory Structure / โครงสร้าง Directory

```
src/
├── application/
│   ├── services/
│   │   ├── ai-categorization.service.ts
│   │   ├── ai-categorization.service.spec.ts
│   │   ├── keyword-categorization.service.ts
│   │   └── keyword-categorization.service.spec.ts
│   └── use-cases/
│       └── transactions/
│           ├── create-transaction.use-case.ts
│           └── update-transaction.use-case.ts
```

### Integration Points / จุดเชื่อมต่อ

1. **Use Cases** / กรณีการใช้งาน: AI service is injected into transaction use cases / AI service ถูก inject เข้าไปใน transaction use cases
2. **Fallback Mechanism** / กลไก Fallback: Keyword-based categorization as backup / การจัดหมวดหมู่ตาม keyword เป็นตัวเลือกสำรอง
3. **Configuration** / การตั้งค่า: Environment-based API key management / การจัดการ API key ผ่าน environment variables

## Usage Examples / ตัวอย่างการใช้งาน

### Basic Categorization / การจัดหมวดหมู่พื้นฐาน

```typescript
// In your service or controller / ใน service หรือ controller ของคุณ
constructor(private aiCategorizationService: AICategorizationService) {}

async categorizeTransaction(title: string) {
  const result = await this.aiCategorizationService.categorize(title);
  
  if (result) {
    console.log(`Category: ${result.category}`);
    console.log(`English Title: ${result.titleEn}`);
  } else {
    console.log('AI categorization failed / การจัดหมวดหมู่ด้วย AI ล้มเหลว');
  }
}
```

### Integration with Transaction Creation / การเชื่อมต่อกับการสร้างธุรกรรม

```typescript
// In create-transaction.use-case.ts / ใน create-transaction.use-case.ts
async execute(createTransactionDto: CreateTransactionDto) {
  let category = createTransactionDto.category;
  let titleEn = createTransactionDto.titleEn;

  // Use AI categorization if not provided / ใช้ AI categorization ถ้ายังไม่ได้ระบุ
  if (!category || !titleEn) {
    const aiResult = await this.aiCategorizationService.categorize(
      createTransactionDto.title
    );
    
    if (aiResult) {
      category = category || aiResult.category;
      titleEn = titleEn || aiResult.titleEn;
    }
  }

  // Continue with transaction creation... / ดำเนินการสร้างธุรกรรมต่อ...
}
```

## Testing / การทดสอบ

### Unit Tests / การทดสอบ Unit

The service includes comprehensive unit tests:

Service นี้มี unit tests ที่ครอบคลุม:

```bash
# Run AI categorization tests / รันการทดสอบ AI categorization
npm test -- ai-categorization.service.spec.ts

# Run all tests / รันการทดสอบทั้งหมด
npm test
```

### Test Coverage / ความครอบคลุมของการทดสอบ

Tests cover:
การทดสอบครอบคลุม:

- **Initialization scenarios** (with/without API key) / สถานการณ์การเริ่มต้น (มี/ไม่มี API key)
- **Successful categorization** / การจัดหมวดหมู่ที่สำเร็จ
- **Error handling** / การจัดการข้อผิดพลาด
- **Response parsing** / การแปลง response
- **Edge cases** / กรณีพิเศษ

### Mock Testing / การทดสอบแบบ Mock

Example test structure:
โครงสร้างการทดสอบตัวอย่าง:

```typescript
describe('AICategorizationService', () => {
  let service: AICategorizationService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AICategorizationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AICategorizationService>(AICategorizationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  // Test cases... / กรณีทดสอบ...
});
```

## Troubleshooting / การแก้ปัญหา

### Common Issues / ปัญหาที่พบบ่อย

#### 1. API Key Not Found / ไม่พบ API Key

**Error** / ข้อผิดพลาด: `GEMINI_API_KEY not configured`

**Solution** / วิธีแก้ไข:
- Verify `.env` file contains the API key / ตรวจสอบว่าไฟล์ `.env` มี API key
- Restart the application after adding the key / รีสตาร์ทแอปพลิเคชันหลังเพิ่ม key
- Check for typos in variable name / ตรวจสอบตัวพิมพ์ผิดในชื่อตัวแปร

#### 2. Model Not Available / Model ไม่พร้อมใช้งาน

**Error** / ข้อผิดพลาด: Model not found or unavailable

**Solution** / วิธีแก้ไข:
- Verify API key has proper permissions / ตรวจสอบว่า API key มีสิทธิ์ที่ถูกต้อง
- Check if the model is available in your region / ตรวจสอบว่า model พร้อมใช้งานในพื้นที่ของคุณ
- Consider using alternative models / พิจารณาใช้ model อื่น

#### 3. Rate Limiting / การจำกัดอัตรา

**Error** / ข้อผิดพลาด: Too many requests

**Solution** / วิธีแก้ไข:
- Implement request queuing / ทำระบบ queue สำหรับคำขอ
- Add delays between requests / เพิ่ม delay ระหว่างคำขอ
- Consider upgrading API tier / พิจารณาอัปเกรด API tier

#### 4. JSON Parsing Errors / ข้อผิดพลาดการแปลง JSON

**Error** / ข้อผิดพลาด: Unexpected response format

**Solution** / วิธีแก้ไข:
- Check prompt structure / ตรวจสอบโครงสร้าง prompt
- Add better response validation / เพิ่มการตรวจสอบ response ที่ดีขึ้น
- Implement fallback parsing / ทำ fallback parsing

### Debug Mode / โหมด Debug

Enable debug logging:
เปิดใช้งาน debug logging:

```typescript
// In ai-categorization.service.ts / ใน ai-categorization.service.ts
constructor(private configService: ConfigService) {
  const apiKey = this.configService.get<string>('GEMINI_API_KEY');
  console.log('AI Service initialized:', !!apiKey);
  // ... rest of initialization / ... ส่วนที่เหลือของการเริ่มต้น
}
```

## Best Practices / แนวทางปฏิบัติที่ดีที่สุด

### 1. Error Handling / การจัดการข้อผิดพลาด

- Always check for API key availability / ตรวจสอบความพร้อมใช้งานของ API key เสมอ
- Implement graceful fallbacks / ทำ fallback ที่สวยงาม
- Log errors for debugging / บันทึกข้อผิดพลาดสำหรับการ debug
- Return null for failed requests / คืนค่า null สำหรับคำขอที่ล้มเหลว

### 2. Performance / ประสิทธิภาพ

- Cache frequently used categorizations / แคชการจัดหมวดหมู่ที่ใช้บ่อย
- Implement request batching / ทำการส่งคำขอเป็นกลุ่ม
- Use appropriate model for the task / ใช้ model ที่เหมาะสมกับงาน
- Monitor API usage / ตรวจสอบการใช้งาน API

### 3. Security / ความปลอดภัย

- Never expose API keys in client code / ไม่เปิดเผย API keys ใน client code
- Use environment variables for secrets / ใช้ environment variables สำหรับความลับ
- Implement rate limiting / ทำ rate limiting
- Validate AI responses / ตรวจสอบความถูกต้องของ AI responses

### 4. Cost Management / การจัดการต้นทุน

- Monitor API usage and costs / ตรวจสอบการใช้งานและต้นทุน API
- Use efficient prompts / ใช้ prompts ที่มีประสิทธิภาพ
- Implement caching to reduce calls / ทำ caching เพื่อลดการเรียกใช้
- Set up budget alerts / ตั้งค่า budget alerts

## Advanced Features / ฟีเจอร์ขั้นสูง

### 1. Custom Categories / หมวดหมู่ที่กำหนดเอง

Extend the categorization system:
ขยายระบบการจัดหมวดหมู่:

```typescript
const customCategories = [
  'Food & Dining',
  'Transportation',
  // ... your custom categories / ... หมวดหมู่ที่กำหนดเองของคุณ
];
```

### 2. Batch Processing / การประมวลผลเป็นกลุ่ม

Process multiple titles at once:
ประมวลผลหลาย titles พร้อมกัน:

```typescript
async batchCategorize(titles: string[]) {
  const results = await Promise.allSettled(
    titles.map(title => this.categorize(title))
  );
  
  return results.map((result, index) => ({
    title: titles[index],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
  }));
}
```

### 3. Confidence Scoring / การให้คะแนนความมั่นใจ

Add confidence levels to categorization:
เพิ่มระดับความมั่นใจในการจัดหมวดหมู่:

```typescript
async categorizeWithConfidence(title: string) {
  // Enhanced prompt that includes confidence scoring / Prompt ที่ปรับปรุงซึ่งรวมการให้คะแนนความมั่นใจ
  const prompt = `
    // ... existing prompt / ... prompt ที่มีอยู่
    Also provide a confidence score (0-1) for your categorization.
    และให้คะแนนความมั่นใจ (0-1) สำหรับการจัดหมวดหมู่ของคุณ
    
    Response format / รูปแบบการตอบกลับ:
    {
      "category": "CategoryName",
      "titleEn": "English Title",
      "confidence": 0.95
    }
  `;
  
  // ... implementation / ... การ implement
}
```

### 4. Model Selection / การเลือก Model

Choose different models based on requirements:
เลือก models ที่แตกต่างกันตามความต้องการ:

```typescript
private initializeModel() {
  const modelType = this.configService.get<string>('GEMINI_MODEL') || 'gemini-flash-latest';
  
  this.model = this.genAI.getGenerativeModel(
    { model: modelType },
    { apiVersion: 'v1beta' }
  );
}
```

## Monitoring and Analytics

### 1. Usage Tracking

Track AI service usage:

```typescript
@Injectable()
export class AICategorizationService {
  private usageCount = 0;
  
  async categorize(title: string) {
    this.usageCount++;
    console.log(`AI service used ${this.usageCount} times`);
    
    // ... existing logic
  }
}
```

### 2. Performance Metrics

Monitor response times and success rates:

```typescript
async categorize(title: string) {
  const startTime = Date.now();
  
  try {
    const result = await this.performCategorization(title);
    const duration = Date.now() - startTime;
    
    console.log(`Categorization completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Categorization failed after ${duration}ms:`, error);
    return null;
  }
}
```

## Future Enhancements

### Planned Features

1. **Multi-language Support**: Extend beyond Thai-English
2. **Custom Prompts**: User-defined categorization rules
3. **Learning System**: Improve accuracy over time
4. **Integration with Other AI Services**: OpenAI, Claude, etc.

### Migration Path

The service is designed to be easily extensible:

```typescript
interface AIProvider {
  categorize(title: string): Promise<CategorizationResult>;
}

@Injectable()
class GeminiProvider implements AIProvider {
  // Current implementation
}

@Injectable()
class OpenAIProvider implements AIProvider {
  // Future implementation
}
```

## Conclusion

This implementation provides a robust foundation for AI-powered transaction categorization using Google Generative AI. The service is designed with:

- **Reliability**: Error handling and fallbacks
- **Performance**: Efficient model selection and caching
- **Maintainability**: Clean architecture and comprehensive tests
- **Extensibility**: Easy to add new features and providers

For questions or issues, refer to the troubleshooting section or check the service logs for detailed error information.

## Additional Resources

- [Google Generative AI Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Project Repository](./README.md)
