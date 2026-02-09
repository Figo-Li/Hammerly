# 🚀 API Integration Quick-Start Guide

## Current Status: ✅ Ready to Use

Your frontend API layer is fully refactored and ready for integration!

---

## 📦 Available APIs

### Authentication (`src/api/auth.ts`)

```typescript
import { registerApi, loginApi, logoutApi } from '@/api/auth';

// Register new user
const registerResult = await registerApi({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'secure123'
});
// Response: { user: {...}, token?: string }

// Login user
const loginResult = await loginApi({
  email: 'john@example.com',
  password: 'secure123'
});
// Response: { user: {...}, token?: string }

// Logout user
const logoutResult = await logoutApi();
// Response: { success: boolean }
```

**Currently Used In**: ✅ `src/pages/auth/page.tsx`

---

### Auctions (`src/api/auction.ts`)

```typescript
import { getAuctions, getAuctionById, placeBid } from '@/api/auction';

// Get all auctions
const auctionsResult = await getAuctions();
// Response: { success: true, data: [...], stats: {...} }

// Get single auction
const auctionResult = await getAuctionById(1);
// Response: { success: true, data: {...} }

// Place a bid
const bidResult = await placeBid(1, 50000);
// Response: { success: true, message: '...' }
```

**Currently Used In**: 📦 Mock data (ready to integrate)

---

## 🔄 How to Integrate Auctions

### Step 1: Update AuctionListings Component

**File**: `src/pages/home/components/AuctionListings.tsx`

```typescript
// ❌ BEFORE
import { auctionListings, auctionStats } from '../../../mocks/auctions';

// ✅ AFTER
import { getAuctions } from '@/api/auction';
import { useState, useEffect } from 'react';

export default function AuctionListings() {
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const result = await getAuctions();
        setAuctions(result.data);
        setStats(result.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Rest of component remains the same, just use state instead of imports
  // Replace: auctionListings → auctions
  // Replace: auctionStats → stats
}
```

### Step 2: Update Auction Detail Component

**File**: `src/pages/auction-detail/page.tsx`

```typescript
// ❌ BEFORE
import { auctionListings } from '../../mocks/auctions';
const auction = auctionListings.find(item => item.id === parseInt(id || '0'));

// ✅ AFTER
import { getAuctionById } from '@/api/auction';
import { useEffect, useState } from 'react';

export default function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAuction = async () => {
      try {
        setLoading(true);
        const result = await getAuctionById(parseInt(id));
        setAuction(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!auction) return <div>Auction not found</div>;

  // Rest of component remains the same
}
```

---

## 🛠️ Common Patterns

### Error Handling

```typescript
try {
  const result = await getAuctions();
  // Handle success
} catch (error) {
  console.error('Failed to fetch:', error.message);
  // Show error to user
}
```

### Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  try {
    setLoading(true);
    const result = await someApi();
    // Process result
  } finally {
    setLoading(false);
  }
};
```

### Using with React Query (Optional Upgrade)

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['auctions'],
  queryFn: getAuctions
});
```

---

## 🔗 Environment Configuration

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

**To change API endpoint**:
1. Update `VITE_API_URL` in `.env.local`
2. Restart dev server
3. All API calls will use new URL

---

## ✅ Integration Checklist

### Prerequisites
- [ ] Backend running on `localhost:5000`
- [ ] Frontend running on `localhost:3000`
- [ ] `.env.local` configured in frontend

### Components to Update
- [ ] `src/pages/home/components/AuctionListings.tsx`
- [ ] `src/pages/auction-detail/page.tsx`
- [ ] `src/pages/profile/components/ProfileBids.tsx` (requires new backend endpoint)

### Testing
- [ ] Test auth registration
- [ ] Test auth login
- [ ] Test fetching auctions
- [ ] Test fetching single auction
- [ ] Test bid placement (if implemented)

---

## 🐛 Debugging Tips

### Check API Calls in Browser
1. Open DevTools → Network tab
2. Look for requests to `/api/*`
3. Check response status and body

### Console Debugging
```typescript
// In components
console.log('API Result:', result);
console.error('API Error:', error);

// All API functions already have console.error calls
```

### Test API Manually
```typescript
// In browser console
const result = await fetch('http://localhost:5000/api/auctions');
const data = await result.json();
console.log(data);
```

---

## 🎯 Migration Progress Template

```markdown
# API Integration Progress

## Authentication
- [x] registerApi implemented and working
- [x] loginApi implemented and working
- [x] logoutApi implemented and working
- [x] Auth component integrated

## Auctions
- [ ] getAuctions integrated in AuctionListings
- [ ] getAuctionById integrated in AuctionDetail
- [ ] placeBid integrated in bidding UI
- [ ] Error handling added
- [ ] Loading states added

## User Features
- [ ] getUserBids backend endpoint created
- [ ] getUserBids API function created
- [ ] ProfileBids component integrated

## Testing
- [ ] All APIs tested manually
- [ ] Components tested with real data
- [ ] Error cases tested
- [ ] Performance checked
```

---

## 📞 Need Help?

### Common Issues

**Issue**: API calls return 404
- Check backend is running on port 5000
- Check endpoint URL matches backend route
- Check `VITE_API_URL` is correct

**Issue**: CORS errors
- Verify `FRONTEND_URL` in backend `.env`
- Check backend has cors middleware enabled
- Verify frontend URL matches CORS configuration

**Issue**: Response doesn't match expected type
- Check backend is returning correct format
- Review `src/api/*/` JSDoc comments for expected shape
- Add `.data` to access wrapped response if needed

### Useful Files for Reference
- Backend routes: `hammerly-backend/src/routes/`
- Frontend API: `hammerly-ui/src/api/`
- Example usage: `hammerly-ui/src/pages/auth/page.tsx`

---

## 🚀 Ready to Go!

Your API structure is production-ready. Start integrating components and watch your app come to life!

**Happy coding! 🎉**
