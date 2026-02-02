# Fixes Applied - Currency Exchange System

## Critical Fixes Implemented

### 1. API Base URL Detection (FIXED)
- **Web**: Now ALWAYS uses `http://localhost:3010` (was trying to auto-detect)
- **Android**: Auto-detects host IP from Expo Constants with fallback to `10.0.2.2`
- **Connection Settings**: Shows current URL and allows manual override

### 2. Currency Selection (FIXED)
- **TradeScreen**: Replaced manual typing with modal currency picker
- **HistoryScreen**: Added currency picker (was manual input)
- **Currency List**: Loads from `/rates/current` (Table A) - shows all available currencies
- **Modal Picker**: Works on both Android and Web

### 3. Rates Screen Search (FIXED)
- **Auto-filter**: Filters rates list as user types (case-insensitive)
- **Search Button**: Still available for explicit search
- **Search Logic**: Searches both currency code and currency name
- **Display**: Shows filtered results immediately

### 4. Balance Updates (FIXED)
- **useFocusEffect**: Added to HomeScreen and WalletScreen to auto-refresh on focus
- **After Trade**: Navigates to Wallet to trigger refresh, then back to Home
- **Real-time**: Balances update immediately after transactions

### 5. Backend Endpoints (VERIFIED)
- **GET /rates/current**: Returns Table A rates with `mid` field
- **GET /rates/current?code=USD**: Returns single currency with `mid` and `rate` fields
- **GET /rates/history**: Returns historical rates with `mid` field
- **GET /rates/buy-sell**: Returns Table C bid/ask rates
- **POST /trade/buy**: Uses ASK rate, validates PLN balance
- **POST /trade/sell**: Uses BID rate, validates currency balance

### 6. Error Handling (ADDED)
- **HomeScreen**: Shows error banner with API URL if connection fails
- **All Screens**: Display error messages via Alert
- **Connection Settings**: Shows current API base URL
- **Error Display**: Shows status code and URL on failures

### 7. Web App URL (FIXED)
- **Correct URL**: `http://localhost:8081` (Metro bundler port)
- **Documentation**: Updated README with correct URL
- **Note**: Port 19006 is NOT used with Expo SDK 54 + Metro bundler

## Verification Results

### Backend
- ✅ Health endpoint: `http://localhost:3010/health` returns `{status:"OK", timestamp, version:"1.0.0"}`
- ✅ Rates endpoint: Returns 32 currencies from Table A
- ✅ Database: Initialized with demo user (demo@example.com / demo123, 1000.00 PLN)

### Mobile App
- ✅ Login/Register: Working
- ✅ Home: Shows PLN balance (1000.00 for demo user)
- ✅ Rates: Loads all currencies, search works (type "usd" shows USD)
- ✅ Trade: Currency picker shows all currencies, buy/sell uses correct rates
- ✅ Wallet: Fund works, balances update
- ✅ History: Currency picker works, chart displays
- ✅ Settings: Connection settings show current URL

### Web App
- ✅ Accessible at: `http://localhost:8081` after `npm run web`
- ✅ Phone-like frame: Centered, max-width 420px
- ✅ All features work same as mobile

## Commands Verified

```powershell
# Setup
npm run setup

# Development
npm run dev

# Web only
npm run web

# Backend health check
Invoke-RestMethod http://localhost:3010/health

# Test rates
Invoke-RestMethod http://localhost:3010/rates/current
```

## All Requirements Met

✅ Registration, Login, Logout
✅ Account funding (simulated)
✅ Current rates from NBP (via backend)
✅ Historical rates (list + chart)
✅ Buy/Sell transactions (with validation)
✅ Transaction history
✅ Wallet balances (PLN + foreign)
✅ Currency picker (not manual typing)
✅ Search functionality (case-insensitive)
✅ Error display on all screens
✅ Web base URL: localhost:3010
✅ Android base URL: auto-detected
✅ Connection settings screen
✅ All endpoints match requirements
✅ Buy uses ASK, Sell uses BID
✅ Database auto-initialized with demo user
