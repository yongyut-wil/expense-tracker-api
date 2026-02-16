# Path Aliases Quick Reference

## ตั้งค่าแล้ว ✅

### Path Aliases ที่พร้อมใช้งาน

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@domain/*": ["src/domain/*"],
      "@application/*": ["src/application/*"],
      "@infrastructure/*": ["src/infrastructure/*"]
    }
  }
}
```

---

## 🎯 วิธีใช้งาน

### 1. Domain Layer Imports

```typescript
// Entities
import { User } from '@domain/entities/user.entity';
import { Transaction } from '@domain/entities/transaction.entity';

// Value Objects
import { Email } from '@domain/value-objects/email.vo';
import { Money } from '@domain/value-objects/money.vo';
import { TransactionType } from '@domain/value-objects/transaction-type.vo';

// Repository Interfaces
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';

// Exceptions
import {
  DomainException,
  UserNotFoundException,
  TransactionNotFoundException,
  EmailAlreadyExistsException,
  InvalidCredentialsException,
} from '@domain/exceptions';
```

### 2. Application Layer Imports

```typescript
// Use Cases - Auth
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '@application/use-cases/auth';

// Use Cases - Transactions
import {
  CreateTransactionUseCase,
  GetTransactionsUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
  GetDashboardUseCase,
} from '@application/use-cases/transactions';

// DTOs - Auth
import { LoginDto } from '@application/dto/auth/login.dto';
import { RegisterDto } from '@application/dto/auth/register.dto';

// DTOs - Transactions
import { CreateTransactionDto } from '@application/dto/transactions/create-transaction.dto';
import { FilterTransactionDto } from '@application/dto/transactions/filter-transaction.dto';

// DTOs - Users
import { CreateUserDto } from '@application/dto/users/create-user.dto';
import { UpdateUserDto } from '@application/dto/users/update-user.dto';
```

### 3. Infrastructure Layer Imports

```typescript
// Database
import { DatabaseModule } from '@infrastructure/database/database.module';
import { PrismaService } from '@infrastructure/prisma/prisma.service';

// Repositories
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { TransactionRepository } from '@infrastructure/database/repositories/transaction.repository';

// Auth
import { AuthModule } from '@infrastructure/auth/auth.module';
import { JwtStrategy } from '@infrastructure/auth/strategies/jwt.strategy';

// HTTP
import { CurrentUser } from '@infrastructure/http/decorators/current-user.decorator';
import { GlobalExceptionFilter } from '@infrastructure/http/filters/http-exception.filter';
import { ResponseInterceptor } from '@infrastructure/http/interceptors/response.interceptor';
```

---

## 📁 โครงสร้างไฟล์

```
src/
├── domain/                    → @domain/*
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   └── exceptions/
├── application/               → @application/*
│   ├── use-cases/
│   └── dto/
└── infrastructure/            → @infrastructure/*
    ├── database/
    ├── prisma/
    ├── auth/
    ├── transactions/
    └── http/
```

---

## ✅ ประโยชน์

### ก่อน (Relative Paths)
```typescript
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/register-user.use-case';
```

**ปัญหา**:
- ❌ ยากต่อการอ่าน
- ❌ นับ `../` ไม่ถูก
- ❌ Refactor ยาก
- ❌ Import ผิดบ่อย

### หลัง (Path Aliases)
```typescript
import { User } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories';
import { RegisterUserUseCase } from '@application/use-cases/auth';
```

**ดีขึ้น**:
- ✅ อ่านง่าย ชัดเจน
- ✅ ไม่ต้องนับ `../`
- ✅ Refactor สะดวก
- ✅ IDE autocomplete ดีขึ้น

---

## 🎉 สถานะ

- **ไฟล์ที่อัพเดทแล้ว**: 23 ไฟล์
- **Use Cases**: 8 ไฟล์ ✅
- **Repositories**: 2 ไฟล์ ✅
- **Mappers**: 2 ไฟล์ ✅
- **Infrastructure Modules**: 3 ไฟล์ ✅
- **Old Services/Controllers**: 8 ไฟล์ ✅

**Build Status**: ✅ **Success** (78 files compiled)

---

## 💡 Tips

1. **ใช้ barrel exports** ให้เต็มที่:
   ```typescript
   // แทนที่จะ
   import { User } from '@domain/entities/user.entity';
   
   // ใช้
   import { User } from '@domain/entities';
   ```

2. **Group imports** ตาม layer:
   ```typescript
   // Domain
   import { User, Transaction } from '@domain/entities';
   import { IUserRepository } from '@domain/repositories';
   
   // Application
   import { RegisterUserUseCase } from '@application/use-cases/auth';
   import { LoginDto } from '@application/dto/auth/login.dto';
   
   // Infrastructure
   import { DatabaseModule } from '@infrastructure/database/database.module';
   ```

3. **IDE จะ autocomplete ให้เอง** พิมพ์ `@` แล้วกด Tab!
