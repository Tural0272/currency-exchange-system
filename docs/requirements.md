# Requirements Specification

## Functional Requirements

### FR1: User Authentication
- **FR1.1**: Users can register with email and password
- **FR1.2**: Users can login with email and password
- **FR1.3**: Users can logout from the application
- **FR1.4**: Authentication uses JWT tokens
- **FR1.5**: Passwords are securely hashed using bcrypt

### FR2: Wallet Management
- **FR2.1**: Users have a PLN wallet that can be funded (simulated)
- **FR2.2**: Users can view all wallet balances (PLN and foreign currencies)
- **FR2.3**: Wallets are automatically created for currencies when needed
- **FR2.4**: Users can fund their PLN wallet with any positive amount

### FR3: Exchange Rates
- **FR3.1**: System displays current exchange rates from NBP API (Table A)
- **FR3.2**: System displays buy/sell rates from NBP API (Table C)
- **FR3.3**: Users can search for specific currency rates
- **FR3.4**: System fetches rates from backend (mobile app does not call NBP directly)

### FR4: Historical Rates
- **FR4.1**: Users can view historical exchange rates for any currency
- **FR4.2**: Historical data is displayed as a list
- **FR4.3**: Historical data is displayed as a simple chart
- **FR4.4**: Users can specify the number of days for historical data (default: 30)

### FR5: Currency Trading
- **FR5.1**: Users can buy foreign currency using PLN
- **FR5.2**: Users can sell foreign currency to receive PLN
- **FR5.3**: System validates sufficient balance before transactions
- **FR5.4**: System uses current NBP buy/sell rates for transactions
- **FR5.5**: Transactions are recorded with timestamp, rate, and amounts

### FR6: Transaction History
- **FR6.1**: Users can view their transaction history
- **FR6.2**: Transactions are displayed in reverse chronological order
- **FR6.3**: Each transaction shows type (BUY/SELL/FUND), currency, amount, rate, and timestamp

## Non-Functional Requirements

### NFR1: Performance
- **NFR1.1**: API responses should complete within 2 seconds for standard operations
- **NFR1.2**: Database queries should be optimized with proper indexes
- **NFR1.3**: Mobile app should provide smooth user experience

### NFR2: Security
- **NFR2.1**: Passwords must be hashed using bcrypt with salt rounds
- **NFR2.2**: JWT tokens must expire after 7 days
- **NFR2.3**: All authenticated endpoints must verify JWT tokens
- **NFR2.4**: Input validation must prevent SQL injection and XSS attacks

### NFR3: Reliability
- **NFR3.1**: System must handle NBP API failures gracefully
- **NFR3.2**: Database transactions must be atomic
- **NFR3.3**: System must validate all user inputs

### NFR4: Usability
- **NFR4.1**: Mobile app must work on Android devices via Expo Go
- **NFR4.2**: Mobile app must work in web browser with phone-like UI
- **NFR4.3**: App must auto-detect backend server IP address
- **NFR4.4**: App must provide connection settings for manual configuration

### NFR5: Compatibility
- **NFR5.1**: Backend must run on Windows PowerShell
- **NFR5.2**: System must use SQLite database (zero setup)
- **NFR5.3**: Mobile app must use Expo SDK compatible with Expo Go
- **NFR5.4**: Backend must bind to 0.0.0.0:3010

### NFR6: Maintainability
- **NFR6.1**: Code must be well-structured and documented
- **NFR6.2**: Database schema must support migrations
- **NFR6.3**: API endpoints must follow RESTful conventions

## System Constraints

### SC1: Technology Stack
- Mobile: React Native with Expo (SDK 51)
- Backend: Node.js with Express
- Database: SQLite with better-sqlite3
- Navigation: React Navigation (not expo-router)

### SC2: Network
- Backend listens on 0.0.0.0:3010
- Mobile app auto-detects host IP with fallbacks
- Android emulator uses 10.0.2.2:3010
- Web uses localhost:3010

### SC3: External Dependencies
- NBP API: https://api.nbp.pl/api/exchangerates
- System must handle NBP API rate limits and errors

### SC4: Data Validation
- Cannot buy currency without sufficient PLN balance
- Cannot sell currency without sufficient currency balance
- All amounts must be positive numbers
- Currency codes must be valid (3-letter uppercase)
