# Centralized API System Architecture

## Overview

This project uses a **3-layer centralized API system** that provides a clean separation of concerns for making API requests with automatic encryption and authentication.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│  Layer 3: Components/Pages              │
│  (Use service functions)                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 2: Services (api.ts)             │
│  (Business logic & specific endpoints)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 1: API Handler (apiHandler.ts)   │
│  (Generic HTTP methods & endpoints)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Axios Client (axiosClient.ts)          │
│  (Encryption, decryption, auth tokens)  │
└─────────────────────────────────────────┘
```

## Layer Details

### Layer 1: API Handler (`src/lib/apiHandler.ts`)

**Purpose**: Provides generic HTTP methods and centralized endpoint definitions

**Features**:
- Generic HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- TypeScript generics for type safety
- Centralized endpoint definitions
- No business logic

**Example**:
```typescript
// Generic HTTP methods
export const api = {
  get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T>
  post: async <T>(endpoint: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T>
  put: async <T>(endpoint: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T>
  delete: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T>
}

// Centralized endpoints
export const endpoints = {
  auth: {
    login: '/api/admin/login',
    logout: '/api/admin/logout',
  },
  testimonials: {
    base: '/api/testimonials',
    byId: (id: string) => `/api/testimonials/${id}`,
  },
  pricing: {
    base: '/api/pricing',
    byId: (id: string) => `/api/pricing/${id}`,
  },
}
```

### Layer 2: Services (`src/services/api.ts`)

**Purpose**: Contains business logic and specific API operations for each domain

**Features**:
- Domain-specific services (auth, testimonials, pricing)
- TypeScript interfaces for data models
- CRUD operations
- Uses `api` and `endpoints` from Layer 1

**Example**:
```typescript
export interface Testimonial {
  id: string;
  name: string;
  message: string;
  // ... other fields
}

export const testimonialsService = {
  getAll: async (): Promise<Testimonial[]> => {
    return api.get<Testimonial[]>(endpoints.testimonials.base);
  },
  
  create: async (data: Partial<Testimonial>): Promise<Testimonial> => {
    return api.post<Testimonial>(endpoints.testimonials.base, data);
  },
  // ... other methods
}
```

### Layer 3: Components/Pages

**Purpose**: Use service functions directly in React components

**Example**:
```typescript
import { testimonialsService } from '@/services/api';

function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  
  useEffect(() => {
    loadTestimonials();
  }, []);
  
  async function loadTestimonials() {
    const data = await testimonialsService.getAll();
    setTestimonials(data);
  }
  
  // ... render component
}
```

## Underlying Infrastructure

### Axios Client (`src/services/axiosClient.ts`)

Provides automatic encryption, decryption, and authentication:

**Request Interceptor**:
1. Encrypts request body using AES encryption
2. Wraps encrypted data in `{ encrypted: encryptedData }`
3. Adds JWT token to Authorization header

**Response Interceptor**:
1. Decrypts response data automatically
2. Handles 401 errors (auto-logout and redirect)
3. Error handling and logging

### Encryption Utility (`src/utils/encryption.ts`)

- Uses `crypto-js` for AES encryption
- Encryption key: `DRINK_HOT_WATER` (matches backend)
- `encryptData()` - Encrypts data before sending
- `decryptData()` - Decrypts received data

## Flow Example: Creating a Testimonial

```typescript
// 1. Component calls service
const newTestimonial = await testimonialsService.create({
  name: 'John Doe',
  message: 'Great service!'
});

// 2. Service calls API handler
return api.post<Testimonial>(endpoints.testimonials.base, data);

// 3. API handler calls axios client
const response = await axiosClient.post(endpoint, data);

// 4. Axios interceptor encrypts data
config.data = { encrypted: encryptData(data) };

// 5. Request sent to backend with JWT token
// Authorization: Bearer <token>

// 6. Response received

// 7. Axios interceptor decrypts response
response.data = decryptData(response.data.encrypted);

// 8. Data flows back through layers to component
```

## Benefits

### 1. Separation of Concerns
- Each layer has a single responsibility
- Easy to maintain and test

### 2. Type Safety
- TypeScript interfaces for all data models
- Generic types for HTTP methods
- Compile-time error checking

### 3. DRY (Don't Repeat Yourself)
- Encryption/decryption logic in one place
- HTTP methods reused across services
- Endpoints defined once

### 4. Security
- Automatic encryption for all requests
- JWT token management
- Secure authentication flow

### 5. Scalability
- Easy to add new endpoints
- Easy to add new services
- Consistent patterns across the app

## Adding New Endpoints

### Step 1: Add endpoint to `apiHandler.ts`

```typescript
export const endpoints = {
  // ... existing endpoints
  contacts: {
    base: '/api/contacts',
    byId: (id: string) => `/api/contacts/${id}`,
  },
}
```

### Step 2: Create service in `api.ts`

```typescript
export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
}

export const contactsService = {
  getAll: async (): Promise<Contact[]> => {
    return api.get<Contact[]>(endpoints.contacts.base);
  },
  
  create: async (data: Partial<Contact>): Promise<Contact> => {
    return api.post<Contact>(endpoints.contacts.base, data as Record<string, unknown>);
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    return api.delete(endpoints.contacts.byId(id));
  },
}
```

### Step 3: Use in component

```typescript
import { contactsService } from '@/services/api';

async function handleSubmit(formData) {
  const contact = await contactsService.create(formData);
  console.log('Created:', contact);
}
```

## Best Practices

### 1. Always use service functions
❌ Don't: `axiosClient.get('/api/testimonials')`
✅ Do: `testimonialsService.getAll()`

### 2. Define TypeScript interfaces
```typescript
export interface MyData {
  id: string;
  name: string;
}
```

### 3. Handle errors in components
```typescript
try {
  await testimonialsService.create(data);
} catch (error) {
  console.error('Failed:', error);
  // Show error message to user
}
```

### 4. Use TypeScript generics
```typescript
const testimonials = await api.get<Testimonial[]>(endpoint);
// TypeScript knows testimonials is Testimonial[]
```

### 5. Keep services focused
- One service per domain/entity
- CRUD operations + any domain-specific logic

## Testing

### Unit Testing Services

```typescript
import { testimonialsService } from '@/services/api';
import { api } from '@/lib/apiHandler';

jest.mock('@/lib/apiHandler');

test('getAll should fetch testimonials', async () => {
  const mockData = [{ id: '1', name: 'John', message: 'Great!' }];
  (api.get as jest.Mock).mockResolvedValue(mockData);
  
  const result = await testimonialsService.getAll();
  
  expect(result).toEqual(mockData);
  expect(api.get).toHaveBeenCalledWith(endpoints.testimonials.base);
});
```

## Configuration

### Backend URL
Set in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

For production:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Encryption Key
Set in `src/utils/encryption.ts`:
```typescript
const ENCRYPTION_KEY = 'DRINK_HOT_WATER';
```
**Must match backend encryption key**

## Summary

The centralized API system provides:
- ✅ Clean architecture with separation of concerns
- ✅ Type-safe API calls with TypeScript
- ✅ Automatic encryption/decryption
- ✅ JWT authentication handling
- ✅ Consistent error handling
- ✅ Easy to maintain and extend
- ✅ DRY principles throughout

All API communication happens through this system, ensuring security, consistency, and maintainability across the entire application.
