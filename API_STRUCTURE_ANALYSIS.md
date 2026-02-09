# Hammerly Frontend-Backend API Structure Analysis

**Date**: February 8, 2026  
**Status**: ✅ Verified and Refactored

---

## 📋 Summary

The frontend has been successfully reorganized with the `services` folder removed and replaced with a new `api` folder following a **one-to-one mapping pattern** between frontend API functions and backend routes.

### Key Changes Made:
- ✅ Removed: `src/services/` folder
- ✅ Created: `src/api/` folder with modular organization
- ✅ Fixed: Auth API exports (loginApi, registerApi, logoutApi)
- ✅ Refactored: Auction API to use named exports
- ✅ Verified: No remaining references to old services folder

---

## 📂 Frontend API Structure

```
src/api/
├── auth.ts       → Handles user authentication
└── auction.ts    → Handles auction operations
```

### File Organization Philosophy
Each file in `src/api/` corresponds to a specific area of functionality and maps directly to backend route files:

| Frontend API | Backend Route | Purpose |
|---|---|---|
| `src/api/auth.ts` | `src/routes/auth.ts` | User registration, login, logout |
| `src/api/auction.ts` | `src/routes/auctions.ts` | Auction listing, retrieval, bidding |

---

## 🔗 Frontend-Backend API Mapping

### Authentication (1:1 Mapping)

#### Auth API (`src/api/auth.ts`)

**1. Register User**
```typescript
// Frontend
export const registerApi = async (payload: RegisterReq): Promise<AuthResponse>

// Backend Route
router.post('/register', (req: Request, res: Response) => {})

// Endpoint
POST /api/auth/register
```

**2. Login User**
```typescript
// Frontend
export const loginApi = async (payload: LoginReq): Promise<AuthResponse>

// Backend Route
router.post('/login', (req: Request, res: Response) => {})

// Endpoint
POST /api/auth/login
```

**3. Logout User**
```typescript
// Frontend
export const logoutApi = async (): Promise<{ success: boolean }>

// Backend Route
router.post('/logout', (req: Request, res: Response) => {})

// Endpoint
POST /api/auth/logout
```

---

### Auctions (1:1 Mapping)

#### Auction API (`src/api/auction.ts`)

**1. Get All Auctions**
```typescript
// Frontend
export const getAuctions = async ()

// Backend Route
router.get('/', (req: Request, res: Response) => {})

// Endpoint
GET /api/auctions
```

**2. Get Auction by ID**
```typescript
// Frontend
export const getAuctionById = async (id: number)

// Backend Route
router.get('/:id', (req: Request, res: Response) => {})

// Endpoint
GET /api/auctions/:id
```

**3. Place Bid**
```typescript
// Frontend
export const placeBid = async (auctionId: number, bidAmount: number)

// Backend Route
router.post('/:id/bid', (req: Request, res: Response) => {})

// Endpoint
POST /api/auctions/:auctionId/bid
```

---

## 📊 Component Usage Status

### Current Usage (Mock Data)
Components are currently using mock data from `src/mocks/`:

| Component | Current Data Source | Next Step |
|---|---|---|
| [AuctionListings.tsx](../hammerly-ui/src/pages/home/components/AuctionListings.tsx) | `mocks/auctions.ts` | Ready to integrate `getAuctions()` |
| [auction-detail/page.tsx](../hammerly-ui/src/pages/auction-detail/page.tsx) | `mocks/auctions.ts` | Ready to integrate `getAuctionById()` |
| [ProfileBids.tsx](../hammerly-ui/src/pages/profile/components/ProfileBids.tsx) | `mocks/myBids.ts` | Ready for user bids endpoint |
| [auth/page.tsx](../hammerly-ui/src/pages/auth/page.tsx) | **✅ Using API** | `loginApi()` and `registerApi()` |

---

## ✅ Verified Working

### ✨ Fixed Issues

1. **Auth API Exports**
   - **Before**: Functions exported within `authApi` object
   - **After**: Direct named exports `loginApi`, `registerApi`, `logoutApi`
   - **Impact**: Matches usage in [auth/page.tsx](../hammerly-ui/src/pages/auth/page.tsx) line 6

2. **Auction API Consistency**
   - **Before**: Only methods in object
   - **After**: Both named exports AND object export
   - **Impact**: Flexibility for future components

3. **Clean Import Path**
   - **Pattern**: `import { loginApi, registerApi } from '@/api/auth'`
   - **Pattern**: `import { getAuctions, getAuctionById } from '@/api/auction'`

### 🔍 No Breaking Changes
- ✅ No remaining references to old `services` folder
- ✅ All imports correctly updated
- ✅ No orphaned code

---

## 🚀 Integration Checklist

### Ready for Frontend Implementation

- [ ] Update [AuctionListings.tsx](../hammerly-ui/src/pages/home/components/AuctionListings.tsx)
  - Replace `mocks/auctions.ts` with `api/auction.ts`
  - Call `getAuctions()` on component mount
  - Handle loading/error states

- [ ] Update [auction-detail/page.tsx](../hammerly-ui/src/pages/auction-detail/page.tsx)
  - Replace `mocks/auctions.ts` with `api/auction.ts`
  - Call `getAuctionById(id)` with route param
  - Handle loading/error states

- [ ] Update [ProfileBids.tsx](../hammerly-ui/src/pages/profile/components/ProfileBids.tsx)
  - Create new backend endpoint: `GET /api/auctions/user/bids`
  - Create frontend API: `getUserBids()`
  - Replace `mocks/myBids.ts`

- [ ] Add Bid Placement
  - Integrate `placeBid(auctionId, bidAmount)` in bidding UI
  - Add success/error handling
  - Update local state on success

---

## 📝 Type Definitions

### Auth Types
```typescript
type LoginReq = { email: string; password: string };
type RegisterReq = { 
  firstName: string; 
  lastName: string; 
  email: string; 
  password: string 
};

type AuthResponse = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token?: string;
};
```

---

## 🔧 Environment Configuration

**Frontend** (`hammerly-ui/.env.local`):
```
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`hammerly-backend/.env`):
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Current API Base URL**: Resolved to `http://localhost:5000/api`

---

## 🎯 Design Principles

This structure follows these principles:

1. **Modularity**: Each API feature is in its own file
2. **One-to-One Mapping**: Frontend functions mirror backend routes
3. **Consistency**: All APIs follow same error handling pattern
4. **Scalability**: Easy to add new features (e.g., `user.ts`, `bids.ts`)
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Centralized Configuration**: Single API base URL in env

---

## 📚 Future Enhancements

Suggested structure for scaling:

```
src/api/
├── auth.ts        → loginApi, registerApi, logoutApi
├── auction.ts     → getAuctions, getAuctionById, placeBid
├── user.ts        → getCurrentUser, updateProfile, getWatchlist
├── bids.ts        → getUserBids, getBidHistory
├── listings.ts    → getUserListings, createListing, updateListing
└── index.ts       → Export all APIs for convenience
```

---

## ✨ Status

**Overall Status**: 🟢 **READY FOR DEVELOPMENT**

- [x] API folder structure created
- [x] One-to-one mapping established
- [x] Type definitions in place
- [x] Error handling standardized
- [x] No legacy code remaining
- [ ] Components integrated with API (next phase)
- [ ] Backend endpoints fully implemented (in progress)

---

## 📞 Notes

- All API functions include JSDoc comments with endpoint mappings
- Base URL configured via environment variable for flexibility
- Mock data remains available during development and testing
- Auth page is already integrated and working with new API structure
