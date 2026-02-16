# 🏗️ คู่มือ Hexagonal Architecture

> อธิบาย Clean Architecture ฉบับภาษาไทย สำหรับ Expense Tracker API

## 📋 สารบัญ

- [Hexagonal Architecture คืออะไร](#hexagonal-architecture-คืออะไร)
- [ทำไมต้องใช้](#ทำไมต้องใช้)
- [โครงสร้าง 3 Layers](#โครงสร้าง-3-layers)
- [Dependency Rule](#dependency-rule)
- [Ports and Adapters](#ports-and-adapters)
- [Design Patterns ที่ใช้](#design-patterns-ที่ใช้)
- [ตัวอย่างการใช้งาน](#ตัวอย่างการใช้งาน)
- [Best Practices](#best-practices)

---

## 🎯 Hexagonal Architecture คืออะไร

**Hexagonal Architecture** (หรือเรียกว่า **Ports and Adapters**) เป็นรูปแบบสถาปัตยกรรมซอฟต์แวร์ที่เน้น:

1. **แยก Business Logic ออกจาก Technical Details**
2. **ทำให้ระบบทดสอบได้ง่าย**
3. **เปลี่ยน Framework/Database ได้โดยไม่กระทบ Core Business**

### หลักการหลัก

```
      ┌──────────────────────────────┐
      │   Infrastructure Layer       │
      │  (Database, HTTP, External)  │
      │                              │
      │  ┌────────────────────────┐  │
      │  │  Application Layer     │  │
      │  │    (Use Cases)         │  │
      │  │                        │  │
      │  │  ┌──────────────────┐  │  │
      │  │  │  Domain Layer    │  │  │
      │  │  │  (Core Business) │  │  │
      │  │  └──────────────────┘  │  │
      │  └────────────────────────┘  │
      └──────────────────────────────┘
```

**Dependency Direction**: **นอก → ใน** (Infrastructure → Application → Domain)

---

## 💡 ทำไมต้องใช้

### ปัญหาของ Traditional Architecture

```typescript
// ❌ Controller ผูกติดกับ Database โดยตรง
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}
  
  @Post()
  async create(@Body() data: CreateUserDto) {
    // Business logic ปนกับ database code
    if (!data.email.includes('@')) throw new Error('Invalid email');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ 
      data: { ...data, password: hashedPassword } 
    });
  }
}
```

**ปัญหา**:
- ❌ ทดสอบยาก (ต้องมี database)
- ❌ Business Logic กระจัดกระจาย
- ❌ เปลี่ยน database ยาก
- ❌ Code ซ้ำซ้อน

### วิธีแก้ด้วย Hexagonal Architecture

```typescript
// ✅ Domain Layer - Pure Business Logic
export class User {
  private constructor(
    public readonly id: number,
    private email: Email,  // Value Object
    // ...
  ) {}
  
  static create(email: string, password: string): User {
    // Business rules อยู่ใน Domain
    return new User(0, Email.create(email), ...);
  }
}

// ✅ Application Layer - Use Case
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(IUserRepository) private userRepo: IUserRepository
  ) {}
  
  async execute(data: RegisterDto): Promise<User> {
    const user = User.create(data.email, data.password);
    return this.userRepo.save(user);
  }
}

// ✅ Infrastructure Layer - Adapter
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}
  
  async save(user: User): Promise<User> {
    const data = UserMapper.toPrisma(user);
    const result = await this.prisma.user.create({ data });
    return UserMapper.toDomain(result);
  }
}
```

**ดีขึ้น**:
- ✅ ทดสอบง่าย (mock repository)
- ✅ Business Logic รวมกันใน Domain
- ✅ เปลี่ยน database ได้ (แค่เปลี่ยน adapter)
- ✅ Code ไม่ซ้ำ

---

## 📦 โครงสร้าง 3 Layers

### 1️⃣ Domain Layer (ชั้นใน)

**ที่อยู่**: `src/domain/`

**หน้าที่**: เก็บ **Core Business Logic** ที่ไม่เปลี่ยนแปลงตาม Technology

#### ประกอบด้วย:

##### 🔹 Entities (หน่วยข้อมูลหลัก)
```typescript
// src/domain/entities/user.entity.ts
export class User {
  private constructor(
    public readonly id: number,
    private readonly email: Email,
    private password: string,
    public readonly name: string,
  ) {}

  // Factory Method
  static create(email: string, password: string, name: string): User {
    return new User(0, Email.create(email), password, name);
  }

  // Business Methods
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (!await this.verifyPassword(oldPassword)) {
      throw new InvalidCredentialsException();
    }
    this.password = await this.hashPassword(newPassword);
  }

  toSafeObject() {
    return {
      id: this.id,
      email: this.email.value,
      name: this.name,
    };
  }
}
```

##### 🔹 Value Objects (ค่าที่ไม่เปลี่ยนแปลง)
```typescript
// src/domain/value-objects/email.vo.ts
export class Email {
  private constructor(public readonly value: string) {}

  static create(email: string): Email {
    const normalized = email.toLowerCase().trim();
    
    if (!this.isValid(normalized)) {
      throw new DomainException('อีเมลไม่ถูกต้อง');
    }
    
    return new Email(normalized);
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

```typescript
// src/domain/value-objects/money.vo.ts
export class Money {
  constructor(public readonly amount: number) {
    if (amount < 0) {
      throw new DomainException('จำนวนเงินต้องไม่ติดลบ');
    }
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  greaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }
}
```

##### 🔹 Repository Interfaces (Ports)
```typescript
// src/domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');
```

##### 🔹 Domain Exceptions
```typescript
// src/domain/exceptions/user-not-found.exception.ts
export class UserNotFoundException extends DomainException {
  constructor(userId: number) {
    super(`ไม่พบผู้ใช้ ID: ${userId}`);
  }
}
```

**กฎสำคัญ**:
- ⛔ **ห้าม** import จาก Application หรือ Infrastructure
- ⛔ **ห้าม** มี Framework code (NestJS, Prisma, etc.)
- ✅ เป็น Pure TypeScript/JavaScript เท่านั้น

---

### 2️⃣ Application Layer (ชั้นกลาง)

**ที่อยู่**: `src/application/`

**หน้าที่**: **ประสานงาน** ระหว่าง Domain และ Infrastructure

#### ประกอบด้วย:

##### 🔹 Use Cases (กรณีการใช้งาน)
```typescript
// src/application/use-cases/auth/register-user.use-case.ts
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: RegisterDto): Promise<AuthResponse> {
    // 1. ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const email = Email.create(data.email);
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser) {
      throw new EmailAlreadyExistsException(email.value);
    }

    // 2. สร้าง User entity
    const user = User.create(data.email, data.password, data.name);

    // 3. บันทึกลง database
    const savedUser = await this.userRepository.save(user);

    // 4. สร้าง JWT token
    const token = this.jwtService.sign({
      userId: savedUser.id,
      email: savedUser.email.value,
    });

    return {
      user: savedUser.toSafeObject(),
      access_token: token,
    };
  }
}
```

##### 🔹 DTOs (Data Transfer Objects)
```typescript
// src/application/dto/auth/register.dto.ts
export class RegisterDto {
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอกอีเมล' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' })
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ' })
  name: string;
}
```

**กฎสำคัญ**:
- ✅ import จาก Domain ได้
- ⛔ **ห้าม** import จาก Infrastructure
- ✅ 1 Use Case = 1 งาน เดียว

---

### 3️⃣ Infrastructure Layer (ชั้นนอก)

**ที่อยู่**: `src/infrastructure/`

**หน้าที่**: **เชื่อมต่อ** กับ External Services (Database, HTTP, etc.)

#### ประกอบด้วย:

##### 🔹 Repository Implementations (Adapters)
```typescript
// src/infrastructure/database/repositories/user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    return data ? UserMapper.toDomain(data) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ 
      where: { email: email.value } 
    });
    return data ? UserMapper.toDomain(data) : null;
  }

  async save(user: User): Promise<User> {
    const prismaData = UserMapper.toPrisma(user);
    
    const saved = user.id === 0
      ? await this.prisma.user.create({ data: prismaData })
      : await this.prisma.user.update({ 
          where: { id: user.id }, 
          data: prismaData 
        });
        
    return UserMapper.toDomain(saved);
  }
}
```

##### 🔹 Mappers (แปลงข้อมูล)
```typescript
// src/infrastructure/database/mappers/user.mapper.ts
export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.reconstruct(
      prismaUser.id,
      prismaUser.email,
      prismaUser.password,
      prismaUser.name,
    );
  }

  static toPrisma(user: User): Prisma.UserCreateInput {
    return {
      email: user.email.value,
      password: user.password,
      name: user.name,
    };
  }
}
```

##### 🔹 Controllers (HTTP Endpoints)
```typescript
// src/infrastructure/http/controllers/auth.controller.ts
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'ลงทะเบียนผู้ใช้ใหม่' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.registerUserUseCase.execute(dto);
    return {
      success: true,
      data: result,
    };
  }
}
```

**กฎสำคัญ**:
- ✅ import จากทุก layer ได้
- ✅ เก็บ Technical Details ทั้งหมด
- ✅ เป็นชั้นเดียวที่เปลี่ยนได้ง่าย

---

## 🔄 Dependency Rule

### กฎเหล็ก: Dependencies ชี้เข้าใน

```
Infrastructure  ──→  Application  ──→  Domain
   (นอก)              (กลาง)          (ใน)
```

**หมายความว่า**:
1. Domain **ไม่รู้จัก** Application และ Infrastructure
2. Application **รู้จัก** Domain, **ไม่รู้จัก** Infrastructure
3. Infrastructure **รู้จัก** ทั้ง Domain และ Application

### ตัวอย่าง

```typescript
// ❌ ผิด - Domain import จาก Infrastructure
// src/domain/entities/user.entity.ts
import { PrismaService } from '@infrastructure/prisma'; // ❌ WRONG!

// ✅ ถูก - Infrastructure import จาก Domain
// src/infrastructure/database/repositories/user.repository.ts
import { User } from '@domain/entities/user.entity'; // ✅ CORRECT!
import { IUserRepository } from '@domain/repositories'; // ✅ CORRECT!
```

---

## 🔌 Ports and Adapters

### Ports (ช่องเสียบ) = Interfaces

**กำหนดใน Domain Layer**

```typescript
// Port (Interface)
export interface IUserRepository {
  save(user: User): Promise<User>;
}
```

### Adapters (ปลั๊ก) = Implementations

**สร้างใน Infrastructure Layer**

```typescript
// Adapter สำหรับ Prisma
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    // Prisma implementation
  }
}

// Adapter สำหรับ MongoDB (สมมติ)
@Injectable()
export class MongoUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    // MongoDB implementation
  }
}
```

### Dependency Injection

```typescript
// Module configuration
@Module({
  providers: [
    {
      provide: IUserRepository,  // Port
      useClass: PrismaUserRepository,  // Adapter
    },
  ],
})
export class DatabaseModule {}
```

**ประโยชน์**:
- ✅ เปลี่ยน database ได้โดยแค่เปลี่ยน adapter
- ✅ ทดสอบง่ายด้วย mock adapter

---

## 🎨 Design Patterns ที่ใช้

### 1. Repository Pattern

**จุดประสงค์**: แยก Data Access Logic ออกจาก Business Logic

```typescript
// Interface (Port)
interface ITransactionRepository {
  findAll(userId: number): Promise<Transaction[]>;
}

// Implementation (Adapter)
class TransactionRepository implements ITransactionRepository {
  async findAll(userId: number): Promise<Transaction[]> {
    const data = await this.prisma.transaction.findMany({...});
    return data.map(TransactionMapper.toDomain);
  }
}
```

### 2. Use Case Pattern

**จุดประสงค์**: 1 Use Case = 1 งาน

```typescript
// แต่ละ Use Case ทำหน้าที่เดียว
class CreateTransactionUseCase { ... }
class GetTransactionsUseCase { ... }
class DeleteTransactionUseCase { ... }
```

### 3. Value Object Pattern

**จุดประสงค์**: ค่าที่ไม่เปลี่ยนแปลง + มี validation

```typescript
class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) throw new Error();
  }
}

class Money {
  constructor(public readonly amount: number) {
    if (amount < 0) throw new Error();
  }
}
```

### 4. Mapper Pattern

**จุดประสงค์**: แปลงข้อมูลระหว่าง layers

```typescript
class UserMapper {
  static toDomain(prisma: PrismaUser): User { ... }
  static toPrisma(user: User): PrismaUserData { ... }
}
```

---

## 🚀 ตัวอย่างการใช้งาน

### Scenario: Login User

#### Flow

```
HTTP Request
    ↓
[AuthController] ──→ [LoginUserUseCase]
                          ↓
                   [IUserRepository] ←── Interface (Port)
                          ↓
                   [UserRepository] ←── Implementation (Adapter)
                          ↓
                     [Prisma]
                          ↓
                     [PostgreSQL]
```

#### Code

```typescript
// 1. Controller รับ request
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUserUseCase.execute(dto);
  }
}

// 2. Use Case ประมวลผล
export class LoginUserUseCase {
  async execute(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new InvalidCredentialsException();
    
    const isValid = await user.verifyPassword(dto.password);
    if (!isValid) throw new InvalidCredentialsException();
    
    return { user, token: this.jwtService.sign({...}) };
  }
}

// 3. Repository ดึงข้อมูล
export class UserRepository {
  async findByEmail(email: Email) {
    const data = await this.prisma.user.findUnique({...});
    return UserMapper.toDomain(data);
  }
}
```

---

## ✅ Best Practices

### 1. Domain Layer

- ✅ **ใช้ Value Objects** สำหรับค่าที่มี validation
- ✅ **Entity ต้องมี business methods** ไม่ใช่แค่ data holder
- ✅ **ใช้ Factory Methods** (`User.create()`) แทน `new User()`
- ⛔ **ห้าม** import framework code

### 2. Application Layer

- ✅ **1 Use Case = 1 task** อย่าทำหลายอย่างใน use case เดียว
- ✅ **Use Case ต้อง testable** โดยไม่ต้องมี database
- ✅ **ใช้ DTOs** สำหรับ input/output validation

### 3. Infrastructure Layer

- ✅ **Mapper แยกชัดเจน** domain ↔ database
- ✅ **Controllers บาง** ไม่มี business logic
- ✅ **Repository ไม่มี business logic** แค่ CRUD

### 4. Testing

```typescript
// ✅ Test Use Case โดย mock repository
describe('RegisterUserUseCase', () => {
  it('should register user', async () => {
    const mockRepo = {
      save: jest.fn().mockResolvedValue(mockUser),
    };
    
    const useCase = new RegisterUserUseCase(mockRepo, jwtService);
    const result = await useCase.execute(dto);
    
    expect(result.user).toBeDefined();
  });
});
```

---

## 📝 สรุป

### ข้อดี Hexagonal Architecture

✅ **Testable** - ทดสอบง่าย ไม่ต้องพึ่ง database  
✅ **Maintainable** - Business Logic อยู่ที่เดียว  
✅ **Flexible** - เปลี่ยน technology ได้ง่าย  
✅ **Clear Structure** - แต่ละ layer มีหน้าที่ชัดเจน  

### ข้อเสีย

❌ **Learning Curve** - ต้องเรียนรู้ concept ใหม่  
❌ **Boilerplate Code** - มี code เยอะขึ้น (mappers, interfaces)  
❌ **Over-engineering สำหรับโปรเจคเล็ก**

### เหมาะกับ

✅ โปรเจคขนาดกลาง-ใหญ่  
✅ ต้องการ testability สูง  
✅ Business logic ซับซ้อน  
✅ ต้องการ maintainability ระยะยาว  

---

**เรียบเรียงโดย**: Expense Tracker API Team  
**อัพเดทล่าสุด**: 16 February 2026
