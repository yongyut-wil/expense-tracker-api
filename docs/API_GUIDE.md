# 🔌 API Usage Guide

## สารบัญ

- [ภาพรวม](#ภาพรวม)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## ภาพรวม

**Base URL**: `http://localhost:3000/api`

**API Documentation**: `http://localhost:3000/api-docs` (Swagger UI)

### 📋 Response Format

ทุก Response จะมีโครงสร้างแบบเดียวกัน:

#### Success Response

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-02-16T03:41:00.000Z"
}
```

#### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-02-16T03:41:00.000Z",
  "path": "/api/auth/login",
  "message": "Invalid credentials"
}
```

---

## Authentication

### 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database
    
    Client->>API: POST /api/auth/register
    API->>Database: Create user
    Database-->>API: User created
    API-->>Client: User data (without password)
    
    Client->>API: POST /api/auth/login
    API->>Database: Find user
    Database-->>API: User data
    API->>API: Verify password
    API->>API: Generate JWT
    API-->>Client: { access_token }
    
    Client->>API: GET /api/auth/me (with Bearer token)
    API->>API: Verify JWT
    API->>Database: Get user
    Database-->>API: User data
    API-->>Client: User data
```

### 📝 Register

**Endpoint**: `POST /api/auth/register`

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-16T03:41:00.000Z",
    "updatedAt": "2026-02-16T03:41:00.000Z"
  },
  "timestamp": "2026-02-16T03:41:00.000Z"
}
```

### 🔑 Login

**Endpoint**: `POST /api/auth/login`

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2026-02-16T03:41:00.000Z"
}
```

### 👤 Get Current User

**Endpoint**: `GET /api/auth/me`

**Request**:
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-16T03:41:00.000Z",
    "updatedAt": "2026-02-16T03:41:00.000Z"
  },
  "timestamp": "2026-02-16T03:41:00.000Z"
}
```

---

## API Endpoints

### 💰 Transactions

#### Create Transaction

**Endpoint**: `POST /api/transactions`

**Authentication**: Required

**Request**:
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "เงินเดือน",
    "amount": 30000,
    "type": "INCOME",
    "category": "เงินเดือน",
    "date": "2026-02-01T00:00:00.000Z"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "เงินเดือน",
    "amount": 30000,
    "type": "INCOME",
    "category": "เงินเดือน",
    "date": "2026-02-01T00:00:00.000Z",
    "userId": 1
  },
  "timestamp": "2026-02-16T03:41:00.000Z"
}
```

#### Get All Transactions

**Endpoint**: `GET /api/transactions`

**Authentication**: Required

**Request**:
```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "เงินเดือน",
      "amount": 30000,
      "type": "INCOME",
      "category": "เงินเดือน",
      "date": "2026-02-01T00:00:00.000Z",
      "userId": 1
    },
    {
      "id": 2,
      "title": "ซื้อของ",
      "amount": 500,
      "type": "EXPENSE",
      "category": "อาหาร",
      "date": "2026-02-02T00:00:00.000Z",
      "userId": 1
    }
  ],
  "timestamp": "2026-02-16T03:41:00.000Z"
}
```

#### Filter Transactions by Date

**Endpoint**: `GET /api/transactions/filter?startDate=...&endDate=...`

**Authentication**: Required

**Request**:
```bash
curl -X GET "http://localhost:3000/api/transactions/filter?startDate=2026-02-01&endDate=2026-02-28" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Dashboard Summary

**Endpoint**: `GET /api/transactions/dashboard`

**Authentication**: Required

**Request**:
```bash
curl -X GET http://localhost:3000/api/transactions/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalIncome": 30000,
    "totalExpense": 5000,
    "balance": 25000,
    "transactionCount": 15,
    "previousMonthIncome": 28000,
    "previousMonthExpense": 4500,
    "incomeChange": 2000,
    "incomeChangePercent": 7.14,
    "expenseChange": 500,
    "expenseChangePercent": 11.11
  },
  "timestamp": "2026-02-16T03:41:00.000Z"
}
```

#### Update Transaction

**Endpoint**: `PATCH /api/transactions/:id`

**Authentication**: Required

**Request**:
```bash
curl -X PATCH http://localhost:3000/api/transactions/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 35000
  }'
```

#### Delete Transaction

**Endpoint**: `DELETE /api/transactions/:id`

**Authentication**: Required

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/transactions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 👥 Users

#### Get All Users

**Endpoint**: `GET /api/users`

**Authentication**: Required

**Request**:
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get User by ID

**Endpoint**: `GET /api/users/:id`

**Authentication**: Required

**Request**:
```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update User

**Endpoint**: `PATCH /api/users/:id`

**Authentication**: Required

**Request**:
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Jane Doe"
  }'
```

#### Delete User

**Endpoint**: `DELETE /api/users/:id`

**Authentication**: Required

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Handling

### 🔴 Common Error Codes

| Status Code | Error Type | คำอธิบาย |
|-------------|------------|----------|
| **400** | Bad Request | ข้อมูลไม่ถูกต้อง/ไม่ครบ |
| **401** | Unauthorized | ไม่มี token หรือ token ไม่ถูกต้อง |
| **403** | Forbidden | ไม่มีสิทธิ์เข้าถึง |
| **404** | Not Found | ไม่พบข้อมูล |
| **409** | Conflict | ข้อมูลซ้ำ (เช่น email ซ้ำ) |
| **500** | Internal Server Error | เกิดข้อผิดพลาดที่ server |

### 📋 Error Examples

#### Validation Error (400)

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-02-16T03:41:00.000Z",
  "path": "/api/auth/register",
  "message": {
    "message": [
      "email must be an email",
      "password must be longer than or equal to 6 characters"
    ],
    "error": "Bad Request",
    "statusCode": 400
  }
}
```

#### Unauthorized (401)

```json
{
  "success": false,
  "statusCode": 401,
  "timestamp": "2026-02-16T03:41:00.000Z",
  "path": "/api/transactions",
  "message": "Unauthorized"
}
```

#### Email Already Exists (400)

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-02-16T03:41:00.000Z",
  "path": "/api/auth/register",
  "message": "Email already exists"
}
```

#### Invalid Credentials (401)

```json
{
  "success": false,
  "statusCode": 401,
  "timestamp": "2026-02-16T03:41:00.000Z",
  "path": "/api/auth/login",
  "message": "Invalid credentials"
}
```

---

## Best Practices

### ✅ API Usage Guidelines

#### 1. **Always Use HTTPS in Production**

```bash
# ✅ Production
https://api.example.com/api/auth/login

# ❌ Development only
http://localhost:3000/api/auth/login
```

#### 2. **Store Tokens Securely**

```javascript
// ✅ ดี: เก็บใน httpOnly cookie หรือ secure storage
localStorage.setItem('token', token); // ⚠️ พอใช้, แต่ระวัง XSS

// ❌ ไม่ดี: เก็บใน plain text
const token = "eyJhbGci...";
```

#### 3. **Handle Token Expiration**

```javascript
// ตรวจสอบ token expiration
try {
  const response = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expired - redirect to login
    window.location.href = '/login';
  }
} catch (error) {
  console.error('Error:', error);
}
```

#### 4. **Use Proper HTTP Methods**

- `GET`: ดึงข้อมูล (Read)
- `POST`: สร้างข้อมูลใหม่ (Create)
- `PATCH`: แก้ไขข้อมูลบางส่วน (Partial Update)
- `PUT`: แก้ไขข้อมูลทั้งหมด (Full Update)
- `DELETE`: ลบข้อมูล (Delete)

#### 5. **Validate Input**

```javascript
// ✅ ดี: Validate ก่อนส่ง
const createTransaction = (data) => {
  if (!data.title || !data.amount || !data.type) {
    throw new Error('Missing required fields');
  }
  
  if (data.amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  return fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
};
```

#### 6. **Rate Limiting**

ระวังการเรียก API มากเกินไป:

```javascript
// ✅ ดี: Debounce search
import { debounce } from 'lodash';

const searchTransactions = debounce(async (query) => {
  const response = await fetch(`/api/transactions?search=${query}`);
  return response.json();
}, 300);
```

#### 7. **Error Handling**

```javascript
// ✅ ดี: Handle errors properly
try {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create transaction');
  }
  
  const result = await response.json();
  return result.data;
} catch (error) {
  console.error('Error creating transaction:', error);
  throw error;
}
```

---

## Testing with Swagger

### 🧪 Swagger UI

เปิด Swagger UI ที่: `http://localhost:3000/api-docs`

**Features**:
- ทดสอบ API โดยตรงใน browser
- ดู Request/Response schemas
- ดูตัวอย่างการใช้งาน
- Authorize ด้วย JWT token

**วิธีใช้**:
1. เปิด Swagger UI
2. คลิก "Authorize" ปุ่มด้านบน
3. ใส่ JWT token: `Bearer YOUR_TOKEN`
4. คลิก endpoint ที่ต้องการทดสอบ
5. คลิก "Try it out"
6. ใส่ parameters/body
7. คลิก "Execute"

---

## สรุป

### 🎯 Quick Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Register | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Get Profile | GET | `/api/auth/me` |
| List Transactions | GET | `/api/transactions` |
| Create Transaction | POST | `/api/transactions` |
| Update Transaction | PATCH | `/api/transactions/:id` |
| Delete Transaction | DELETE | `/api/transactions/:id` |
| Dashboard | GET | `/api/transactions/dashboard` |

### 📚 เอกสารที่เกี่ยวข้อง

- [Database Schema](DATABASE_SCHEMA.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)
