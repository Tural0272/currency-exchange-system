# Currency Exchange System

A complete currency exchange system with mobile app, REST API backend, and SQLite database. The system integrates with the National Bank of Poland (NBP) API to provide real-time and historical exchange rates.

## Author Information

**Author**: Tural Alakbarov  
**Index Number**: 39251  
**Email**: tural0272@gmail.com

---

## Quick Start (for evaluation)

> Note: `node_modules/` is not included in the submitted archive. Install dependencies before running.

### Option A (recommended): setup + run
```powershell
npm run setup
npm run dev
```

Expected:
- Backend starts on `http://localhost:3010`
- Health check: `http://localhost:3010/health`
- Expo starts and shows a QR code (phone) and web options

### Option B: run services separately (2 terminals)
**Terminal 1 (backend):**
```powershell
cd backend
npm install
npm run dev
```

**Terminal 2 (mobile):**
```powershell
cd mobile
npm install
npm start
```

### Web only
```powershell
npm run web
```
Open the URL shown in the terminal (often `http://localhost:8081`).


## Overview

This system consists of three main components:

1. **Mobile App** (React Native/Expo) - Cross-platform mobile application
2. **REST API Backend** (Node.js/Express) - Business logic and NBP API integration
3. **SQLite Database** - Local database for users, wallets, and transactions

### Architecture

```
Mobile App (Expo/React Native)
    ↕ HTTP/REST
REST API Backend (Express)
    ↕ HTTP
NBP API (External)
    ↕ SQL
SQLite Database (Local)
```

## Features

### Mobile App Features
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Wallet funding (simulated PLN deposits)
- ✅ View current exchange rates from NBP
- ✅ View historical exchange rates with charts
- ✅ Buy foreign currency using PLN
- ✅ Sell foreign currency to receive PLN
- ✅ Transaction history
- ✅ Multi-currency wallet balances
- ✅ Auto IP detection with manual override
- ✅ Connection settings for backend URL
- ✅ Works on Android (Expo Go) and Web browser

### Backend Features
- ✅ RESTful API endpoints
- ✅ JWT authentication middleware
- ✅ Password hashing with bcrypt
- ✅ NBP API integration (Table A and Table C)
- ✅ Transaction validation (balance checks)
- ✅ SQLite database with automatic initialization
- ✅ Health check endpoint

## Technology Stack

### Mobile
- **Framework**: React Native 0.81.5
- **Platform**: Expo SDK 54
- **React**: 19.1.0
- **Navigation**: React Navigation 6 (Bottom Tabs + Stack)
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **HTTP Client**: Axios 1.6.2

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **Database**: SQLite with better-sqlite3 9.2.2
- **Authentication**: jsonwebtoken 9.0.2
- **Security**: bcryptjs 2.4.3
- **HTTP Client**: Axios 1.6.2

### Development Tools
- **Package Manager**: npm
- **Process Manager**: npm-run-all 4.1.5
- **Health Check**: wait-on 7.2.0
- **Backend Dev**: nodemon 3.0.2

## Prerequisites

> If you use an older Node.js version, Expo/React Native may fail to start. Upgrade Node.js to v20.19.4+ if you encounter startup errors.

- **Node.js** (v20.19.4 or higher recommended)
- **npm** (comes with Node.js)
- **Expo Go** app (for Android testing) - Download from Google Play Store
- **Windows PowerShell** (for running scripts)

## Installation & Setup

### Step 1: Clone/Download the Repository

Ensure you have the project files in a directory.

### Step 2: Install Dependencies

Open PowerShell in the project root directory and run:

```powershell
npm run setup
```

This command will:
1. Install root dependencies
2. Install backend dependencies
3. Install mobile dependencies
4. Fix Expo dependencies compatibility
5. Initialize the database with demo user

**Expected output**: All packages installed, database initialized, demo user created.

### Step 3: Verify Setup

The setup creates a demo user:
- **Email**: demo@example.com
- **Password**: demo123
- **Initial Balance**: 1000.00 PLN

## Running the Application

### Start Backend and Mobile Together

```powershell
npm run dev
```

This command:
1. Starts the backend server on `http://0.0.0.0:3010`
2. Waits for backend health check
3. Starts Expo development server
4. Displays QR code for Expo Go

### Start Web Version Only

**Backend must be running** for login and API. In one terminal run `npm run dev:backend`, then in another:

```powershell
npm run web
```

1. Wait for "Web Bundled" message in terminal
2. **Open browser manually** to: **`http://localhost:8081`** (the browser often does not open by itself)
3. App displays in a phone-like UI frame

**Note**: With Expo SDK 54 and Metro bundler, the web app is served on port 8081 (the Metro bundler port).

### Individual Services

**Backend only**:
```powershell
npm run dev:backend
```

**Mobile only** (after backend is running):
```powershell
cd mobile
npm start
```

## Using the Application

### Mobile (Android via Expo Go)

1. **Start the app**: Run `npm run dev`
2. **Open Expo Go** on your Android phone
3. **Scan QR code** displayed in terminal
4. **Ensure same network**: Phone and computer must be on the same Wi-Fi network
5. **Login**: Use demo credentials or register a new account

### Web Browser

1. **Start the backend** (required for login and API): In one terminal run `npm run dev:backend`
2. **Start web version**: In a second terminal run `npm run web` from repo root
3. **Wait for bundling**: Wait until you see "Web Bundled" (or "Bundled successfully") in the terminal
4. **Open in Chrome (or any browser)**:
   - **Manually open** the app: in the address bar type **`http://localhost:8081`** and press Enter
   - Or on Windows run `npm run web:open` in a third terminal (after `npm run web` is running) to open the default browser
5. **App displays** in a phone-like frame (max width 420px)
6. **To register a new account**: On the Login screen tap **"Create new account (Register)"** or **"Don't have an account? Tap here to Register"**. After logging out, use Settings → **"Register new account"** to log out and return to Login, then tap **"Create new account"** again.

**Note**: The app is served on port 8081. The browser often does not open automatically—always type `http://localhost:8081` in the address bar after "Web Bundled" appears.

## API Endpoints

### Health Check
- **GET** `/health` - Server status

### Authentication
- **POST** `/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }
  ```
- **POST** `/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Exchange Rates
- **GET** `/rates/current` - Get all current rates (Table A)
- **GET** `/rates/current?code=USD` - Get specific currency rate
- **GET** `/rates/history?code=USD&days=30` - Get historical rates
- **GET** `/rates/buy-sell?code=USD` - Get buy/sell rates (Table C)

### Wallet
- **GET** `/wallet/balances` - Get all wallet balances (requires auth)
- **POST** `/wallet/fund` - Fund PLN wallet (requires auth)
  ```json
  {
    "amountPLN": 100.00
  }
  ```

### Trading
- **POST** `/trade/buy` - Buy foreign currency (requires auth)
  ```json
  {
    "code": "USD",
    "amountForeign": 100.00
  }
  ```
- **POST** `/trade/sell` - Sell foreign currency (requires auth)
  ```json
  {
    "code": "USD",
    "amountForeign": 50.00
  }
  ```

### Transactions
- **GET** `/transactions` - Get transaction history (requires auth)

**Note**: All authenticated endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

### Users Table
- `id` (INTEGER, PRIMARY KEY)
- `email` (TEXT, UNIQUE, NOT NULL)
- `passwordHash` (TEXT, NOT NULL)
- `name` (TEXT)
- `createdAt` (TEXT, DEFAULT CURRENT_TIMESTAMP)

### Wallets Table
- `id` (INTEGER, PRIMARY KEY)
- `userId` (INTEGER, FOREIGN KEY → users.id)
- `currencyCode` (TEXT, NOT NULL)
- `balance` (REAL, DEFAULT 0)
- UNIQUE(userId, currencyCode)

### Transactions Table
- `id` (INTEGER, PRIMARY KEY)
- `userId` (INTEGER, FOREIGN KEY → users.id)
- `type` (TEXT, CHECK: 'BUY'|'SELL'|'FUND')
- `currencyCode` (TEXT)
- `amount` (REAL, NOT NULL)
- `rate` (REAL)
- `plnChange` (REAL)
- `createdAt` (TEXT, DEFAULT CURRENT_TIMESTAMP)

## Network Configuration

### Backend
- **Host**: 0.0.0.0 (listens on all interfaces)
- **Port**: 3010
- **Health Check**: `http://localhost:3010/health`

### Mobile App Auto-Detection
The mobile app automatically detects the backend URL using:
1. Expo Constants `hostUri` or `debuggerHost`
2. Android emulator fallback: `http://10.0.2.2:3010`
3. Manual configuration via Settings → Connection Settings

### Manual Configuration
If auto-detection fails:
1. Find your computer's IP address: `ipconfig` in PowerShell
2. Look for "IPv4 Address" (e.g., 192.168.1.100)
3. In app: Settings → Connection Settings
4. Enter: `http://[YOUR_IP]:3010`
5. Save and restart app

## Troubleshooting

### npm-run-all Not Found
**Error**: `"npm-run-all" is not recognized as an internal or external command`

**Cause**: Root dependencies were not installed.

**Fix (in project root):**
```powershell
npm install
npm run dev
```

Alternative: run backend + mobile separately (see Quick Start Option B).

### nodemon Not Found (backend)
**Error**: `"nodemon" is not recognized as an internal or external command`

**Fix:**
```powershell
cd backend
npm install
npm run dev
```


### Port 3010 Already in Use
**Error**: `EADDRINUSE: address already in use :::3010`

**Solution**:
- Close other applications using port 3010
- Or change port in `backend/server.js` (requires updating mobile connection settings)

### Cannot Connect to Backend
**Symptoms**: Mobile app shows connection errors

**Solutions**:
1. Verify backend is running: Check terminal for "Server running on http://0.0.0.0:3010"
2. Test health endpoint: Open `http://localhost:3010/health` in browser
3. Check firewall: Windows Firewall may block port 3010
4. Verify network: Phone and computer must be on same Wi-Fi
5. Use Connection Settings: Manually enter backend URL in app
6. Android emulator: Use `http://10.0.2.2:3010`

### PowerShell Script Errors
**Error**: `&&` operator not recognized

**Solution**: Scripts use `npm-run-all` for cross-platform compatibility. If issues persist:
- Use Git Bash or WSL instead of PowerShell
- Or run commands individually:
  ```powershell
  cd backend
  npm install
  cd ../mobile
  npm install
  ```

### Database Errors
**Error**: Database initialization fails

**Solution**:
```powershell
cd backend
npm run db:init
```

### Expo Go Connection Issues
**Symptoms**: Cannot scan QR code or connect

**Solutions**:
1. Ensure same Wi-Fi network
2. Try tunnel mode: In Expo, press `s` to switch to tunnel
3. Type URL manually in Expo Go
4. Check Windows Firewall settings
5. Use web version for testing: `npm run web`

### Web (browser) does not open
**Symptoms**: Blank page, "This site can't be reached", or app worked once then stops loading

**Solutions**:
1. **Always open manually**: After running `npm run web`, wait for "Web Bundled", then in Chrome (or any browser) type **`http://localhost:8081`** in the address bar and press Enter. The browser often does not open by itself. Or run **`npm run web:open`** in a second terminal (while `npm run web` is running) to open the default browser.
2. **Check the correct port**: If 8081 fails, look at the terminal where `npm run web` is running—it will show the URL (e.g. sometimes `http://localhost:19006`). Use that URL in the browser.
3. **Backend must be running**: For login and API, start the backend first: `npm run dev:backend` in one terminal, then `npm run web` in another. Without the backend, login and data will fail.
4. **One app at a time**: If you ran `npm run dev` (backend + Expo), you can press **`w`** in that same terminal to open web instead of running `npm run web` separately.
5. **Clear cache**: If the page was working and then stops, try hard refresh (Ctrl+Shift+R) or open the URL in an incognito/private window.
6. **Port free**: Ensure no other app is using the same port. If Metro fails to start, close other terminals that might be running Expo.

### NBP API Errors
**Error**: Failed to fetch exchange rates

**Solutions**:
1. Check internet connection
2. Verify NBP API is accessible: https://api.nbp.pl/api/exchangerates/tables/a/
3. Some currencies may not be available (check NBP documentation)
4. API may have rate limits

## Project Structure

```
currency-exchange-system/
├── backend/
│   ├── db/
│   │   └── database.js          # SQLite initialization
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/
│   │   ├── auth.js              # Registration/login
│   │   ├── rates.js             # Exchange rates
│   │   ├── wallet.js            # Wallet operations
│   │   ├── trade.js             # Buy/sell transactions
│   │   └── transactions.js       # Transaction history
│   ├── scripts/
│   │   └── init-db.js           # Database initialization
│   ├── server.js                # Express server
│   └── package.json
├── mobile/
│   ├── assets/                  # App icons and images
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── RatesScreen.js
│   │   ├── HistoryScreen.js
│   │   ├── TradeScreen.js
│   │   ├── WalletScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── AboutScreen.js
│   │   └── ConnectionSettingsScreen.js
│   ├── context/
│   │   └── AuthContext.js       # Authentication state
│   ├── utils/
│   │   └── api.js                # API client and IP detection
│   ├── App.js                    # Main app component
│   ├── app.json                  # Expo configuration
│   └── package.json
├── docs/
│   ├── requirements.md          # Functional/non-functional requirements
│   ├── usecase.puml             # Use case diagram
│   ├── class_mobile.puml        # Mobile class diagram
│   ├── class_backend.puml       # Backend class diagram
│   ├── erd.mmd                  # Entity-relationship diagram
│   ├── user_manual.md           # User guide
│   └── report_template.md       # Project report template
├── package.json                  # Root package.json with scripts
└── README.md                     # This file
```

## Demo Credentials

For quick testing, use the pre-created demo account:

- **Email**: demo@example.com
- **Password**: demo123
- **Initial Balance**: 1000.00 PLN

## Verification

The system has been verified to work on:
- ✅ Windows 10/11 with PowerShell
- ✅ Android devices via Expo Go
- ✅ Web browsers (Chrome, Edge, Firefox)
- ✅ Local network (Wi-Fi)
- ✅ Android emulator (10.0.2.2)

**Verification Steps Performed**:
1. `npm run setup` - All dependencies installed successfully
2. `npm run dev` - Backend starts on port 3010, mobile waits for health check
3. Health endpoint tested: `Invoke-RestMethod http://localhost:3010/health` returns `{status:"OK", timestamp, version:"1.0.0"}`
4. Rates endpoint tested: `Invoke-RestMethod http://localhost:3010/rates/current` returns Table A rates with `mid` field
5. Mobile app connects via auto-detected IP (Android) or `http://localhost:3010` (Web)
6. Web version accessible at `http://localhost:8081` after running `npm run web` and waiting for "Web Bundled"
7. All screens functional: Login (demo@example.com/demo123), Register, Home (shows PLN 1000.00), Rates (search works), History (chart works), Trade (currency picker works), Wallet (fund works), Settings
8. Database initialized with demo user (1000.00 PLN balance)
9. NBP API integration working (Table A current rates, Table C buy/sell rates, historical rates)
10. Buy/Sell transactions use correct rates (ASK for buy, BID for sell) and update balances correctly

## Common Teacher Questions

**Q: How does the mobile app connect to the backend?**  
A: The app auto-detects the host IP using Expo Constants. If detection fails, users can manually configure the backend URL in Settings → Connection Settings.

**Q: What happens if NBP API is down?**  
A: The backend returns appropriate error messages. The mobile app displays these errors to the user. Transactions cannot proceed without valid rates.

**Q: How are transactions validated?**  
A: Before executing buy/sell transactions, the system checks:
- For BUY: Sufficient PLN balance
- For SELL: Sufficient foreign currency balance
- All amounts must be positive numbers

**Q: Is the database persistent?**  
A: Yes, SQLite database file (`backend/db/currency_exchange.db`) persists between runs. Data is saved immediately after transactions.

**Q: Can multiple users use the system?**  
A: Yes, each user has isolated wallets and transactions. The system supports multiple concurrent users.

**Q: How do I reset the database?**  
A: Delete `backend/db/currency_exchange.db` and run `npm run db:init` to recreate with demo user.

## License

ISC

## Support

For issues or questions, contact: tural0272@gmail.com