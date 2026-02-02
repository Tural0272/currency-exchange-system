# User Manual

## Getting Started

### Prerequisites
- Node.js installed on your computer
- Expo Go app installed on your Android phone (for mobile testing)
- Phone and computer on the same Wi-Fi network

### Initial Setup

1. Open PowerShell in the project directory
2. Run: `npm run setup`
   - This installs all dependencies for root, backend, and mobile
   - Initializes the database with demo user
3. Run: `npm run dev`
   - Starts the backend server on port 3010
   - Starts the Expo development server
   - Mobile app will wait for backend to be ready

### Demo Credentials

- **Email**: demo@example.com
- **Password**: demo123
- **Initial Balance**: 1000.00 PLN

## Using the Mobile App

### Login/Registration

1. **Login**: Enter your email and password, then tap "Login"
2. **Register**: Tap "Don't have an account? Register" and fill in:
   - Name (optional)
   - Email
   - Password (minimum 6 characters)

### Home Screen

- Displays your PLN balance at the top
- Shows foreign currency balances (if any)
- Quick action buttons:
  - Buy/Sell Currency
  - Fund Wallet
  - View Rates

### Rates Screen

- View all current exchange rates from NBP
- Search for specific currencies
- Tap any currency to see detailed rate information
- Pull down to refresh rates

### History Screen

1. Enter a currency code (e.g., USD, EUR)
2. Enter number of days (default: 30)
3. Tap "Load History"
4. View historical rates as:
   - Simple line chart
   - Detailed list with dates and rates

### Trade Screen

**Buying Currency:**
1. Select "Buy" tab
2. Enter currency code (e.g., USD)
3. Tap "Refresh Rate" to get current buy rate
4. Enter amount of foreign currency to buy
5. Tap "Buy [CURRENCY]"
6. System validates you have enough PLN

**Selling Currency:**
1. Select "Sell" tab
2. Enter currency code
3. Tap "Refresh Rate" to get current sell rate
4. Enter amount of foreign currency to sell
5. Tap "Sell [CURRENCY]"
6. System validates you have enough currency

### Wallet Screen

- View all wallet balances
- Fund your PLN wallet:
  1. Enter amount in PLN
  2. Tap "Fund Wallet"
  3. Balance updates immediately

### Settings Screen

- **Connection Settings**: Manually set backend URL if auto-detection fails
- **About**: View author information and system details
- **Logout**: Sign out of the application

## Using the Web Version

1. Run: `npm run web` from repo root
2. Wait for "Web Bundled" message in terminal
3. Open browser to: **`http://localhost:8081`**
4. App displays in a phone-like frame for easy testing
5. All features work the same as mobile version

**Note**: With Expo SDK 54 and Metro bundler, the web app is served on port 8081 (Metro bundler port), not 19006.

## Troubleshooting

### Connection Issues

**Problem**: App cannot connect to backend

**Solutions**:
1. Check that backend is running (should see "Server running on http://0.0.0.0:3010")
2. Verify phone and computer are on same Wi-Fi network
3. Go to Settings → Connection Settings
4. Enter your computer's IP address manually:
   - Find your IP: `ipconfig` in PowerShell (look for IPv4 Address)
   - Enter: `http://[YOUR_IP]:3010`
5. For Android emulator, use: `http://10.0.2.2:3010`

### Port Already in Use

**Problem**: Port 3010 is already in use

**Solution**: 
- Close other applications using port 3010
- Or change port in `backend/server.js` (requires updating mobile connection settings)

### Database Errors

**Problem**: Database initialization fails

**Solution**:
- Run: `cd backend && npm run db:init`
- Check that `backend/db/currency_exchange.db` file exists

### Expo Go Connection

**Problem**: Cannot scan QR code or connect via Expo Go

**Solutions**:
1. Ensure phone and computer are on same network
2. Try typing the connection URL manually in Expo Go
3. Check firewall settings on Windows
4. Use tunnel mode: `npm start` then press `s` to switch to tunnel

## Features Overview

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Wallet funding (simulated)
- ✅ Real-time exchange rates from NBP
- ✅ Historical rate charts
- ✅ Buy/sell currency transactions
- ✅ Transaction history
- ✅ Multi-currency wallet balances
- ✅ Auto IP detection with manual override
- ✅ Works on Android and Web

## Tips

1. **Refresh Rates**: Always refresh rates before trading to get latest prices
2. **Check Balances**: Verify you have sufficient balance before trading
3. **Transaction History**: View all past transactions in the transaction history
4. **Connection Settings**: Save your backend URL if auto-detection doesn't work
5. **Demo Account**: Use the demo account to explore features without registration
