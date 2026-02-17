# API Integration Guide

## Overview
This project uses optional encrypted API communication with JWT authentication. API requests and responses can be automatically encrypted/decrypted using AES encryption with the key `DRINK_HOT_WATER`, controlled by the `VITE_ENCRYPT_API` environment variable.

## Architecture

### 1. Encryption Utility (`src/utils/encryption.ts`)
- **encryptData()**: Encrypts data using AES encryption
- **decryptData()**: Decrypts data using AES decryption
- Encryption key: `DRINK_HOT_WATER` (must match backend)

### 2. Axios Client (`src/services/axiosClient.ts`)
Configured axios instance with conditional encryption/decryption interceptors.

#### Request Interceptor
- Conditionally encrypts request body if `VITE_ENCRYPT_API=true`
- Wraps encrypted data in `{ payload: encryptedData }`
- Adds JWT token to Authorization header

#### Response Interceptor
- Conditionally decrypts response data if `VITE_ENCRYPT_API=true`
- Handles 401 errors (redirects to login)
- Error handling with detailed messages

### 3. API Services (`src/services/api.ts`)
Pre-configured service functions for common API operations:
- **adminAuthService**: Login, logout, authentication checks
- **testimonialsService**: CRUD operations for testimonials
- **pricingService**: CRUD operations for pricing plans

### 4. Protected Routes (`src/components/ProtectedRoute.tsx`)
Wrapper component that checks for authentication before rendering admin pages.

## Usage

### Making API Calls

**Option 1: Using axios client directly**
```typescript
import axiosClient from '@/services/axiosClient';

const response = await axiosClient.post('/api/endpoint', {
  key: 'value'
});
```

**Option 2: Using service functions (recommended)**
```typescript
import { testimonialsService } from '@/services/api';

// Get all testimonials
const testimonials = await testimonialsService.getAll();

// Create a testimonial
const newTestimonial = await testimonialsService.create({
  name: 'John Doe',
  message: 'Great service!'
});
```

### Authentication Flow

1. User submits login credentials
2. Request is encrypted and sent to `/api/login`
3. Backend validates and returns JWT token (encrypted)
4. Response is decrypted automatically
5. Token is stored in localStorage as `authToken`
6. Token is automatically added to all subsequent requests

### Logout
```typescript
import { adminAuthService } from '@/services/api';

adminAuthService.logout();
// Redirects to login page
```

## Environment Configuration

Backend URL and encryption are configured in `.env` files:

**Development (.env):**
```env
VITE_API_BASE_URL=http://localhost:5000
# VITE_ENCRYPT_API=false (default, encryption disabled)
```

**Production (.env.production):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENCRYPT_API=false
```

## Protected Routes

All admin routes are automatically protected:
- `/admin/dashboard`
- `/admin/pricing`
- `/admin/testimonials`
- `/admin/razorpay`

If user is not authenticated, they are redirected to `/login/admin-portal`.

## Error Handling

### 401 Unauthorized
- Automatically clears token
- Redirects to login page

### Other Errors
- Logged to console
- Can be caught and handled in your components:

```typescript
try {
  await testimonialsService.create(data);
} catch (error) {
  console.error('Failed to create testimonial:', error);
  // Show error message to user
}
```

## Security Notes

1. **Encryption Key**: Must match between frontend and backend
2. **JWT Token**: Stored in localStorage (consider httpOnly cookies for production)
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiration**: Implement token refresh for production use

## Adding New API Endpoints

1. Add service function in `src/services/api.ts`:
```typescript
export const myNewService = {
  getData: async () => {
    const response = await axiosClient.get('/api/my-endpoint');
    return response.data;
  },
};
```

2. Use in components:
```typescript
import { myNewService } from '@/services/api';

const data = await myNewService.getData();
```

Encryption/decryption happens automatically!
