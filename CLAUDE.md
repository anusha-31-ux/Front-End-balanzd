# Balanzed Frontend

React + TypeScript admin dashboard for a fitness/health platform. Manages pricing plans, personal training services, testimonials, promo banners, and Razorpay transactions.

## Stack

- **Framework:** React 18 + TypeScript (Vite)
- **Styling:** Tailwind CSS + shadcn/ui components
- **HTTP:** Axios via centralized `api` handler (`src/lib/apiHandler.ts`)
- **Routing:** React Router v6

## Dev

```bash
npm run dev      # starts Vite dev server (uses .env.development)
npm run build    # production build
```

## Project Structure

```
src/
├── admin/
│   ├── AdminLayout.tsx           # Fixed header (73px) + sidebar (64 units)
│   ├── components/AdminSidebar.tsx
│   └── pages/                    # One file per admin page
│       ├── Dashboard.tsx
│       ├── Pricing.tsx
│       ├── PersonalTraining.tsx
│       ├── Testimonials.tsx
│       ├── PromoBanner.tsx
│       └── transaction.tsx
├── components/
│   ├── admin/                    # Management components (CRUD UIs)
│   └── ui/                       # shadcn/ui primitives
├── services/                     # API service modules
├── lib/
│   ├── apiHandler.ts             # Central api object + endpoints registry
│   └── utils.ts
├── types/                        # Shared TypeScript interfaces
└── utils/encryption.ts
```

## API Layer

All requests go through `src/lib/apiHandler.ts`:

```typescript
import { api, endpoints } from "@/lib/apiHandler";

// GET
const data = await api.get<MyType>(endpoints.admin.pricing.plans);

// POST / PUT / PATCH / DELETE also available
```

All admin endpoint paths are defined in the `endpoints` object in `apiHandler.ts` — always use these constants, never hardcode paths.

The handler automatically decrypts responses when `VITE_ENCRYPT_API=true`.

**Exception:** `testimonialService` uses `axiosClient` directly (multipart uploads + legacy pattern) and returns unwrapped data. All other services use `api`.

## Styling Conventions

- **Background:** `from-slate-900 to-slate-950` gradient
- **Primary text:** `text-white`
- **Secondary text:** `text-slate-400`
- **Card borders:** `border-slate-200/10`
- **Skeleton loading:** `bg-slate-800/60`
- **Page content padding:** `pt-[120px] md:pt-[100px] px-4 md:px-6`
- **Sticky page header:** `fixed top-[90px] md:top-[73px] left-0 md:left-64 right-0 z-20 backdrop-blur`

Always follow this dark theme. Do not introduce light-mode styles.

## Admin Page Pattern

Every admin page:
1. Wraps content in `<AdminLayout>`
2. Has a sticky header bar (fixed position, matches pattern above)
3. Uses `pt-[120px] md:pt-[100px]` on the content wrapper
4. Shows `<Skeleton>` components while loading
5. Uses `toast` (Sonner) for success/error feedback
6. Uses `<AlertDialog>` for destructive confirmations

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL |
| `VITE_ENCRYPT_API` | `"true"` to enable request/response encryption |

## Backend

The backend lives at `../Server-Balanzed`. See its `CLAUDE.md` for details.
