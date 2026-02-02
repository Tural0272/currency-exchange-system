# Currency Exchange System - Project Report

**Author**: Tural Alakbarov  
**Index Number**: 39251  
**Email**: tural0272@gmail.com  
**Date**: [Insert Date]

---

## Table of Contents

1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Requirements Analysis](#requirements-analysis)
4. [Design](#design)
5. [Implementation](#implementation)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Conclusion](#conclusion)
9. [References](#references)

---

## 1. Introduction

### 1.1 Project Overview
This document describes the development of a complete currency exchange system consisting of a mobile application, REST API backend, and SQLite database. The system integrates with the National Bank of Poland (NBP) API to provide real-time and historical exchange rates.

### 1.2 Objectives
- Develop a cross-platform mobile application using React Native and Expo
- Create a RESTful web service using Node.js and Express
- Implement secure user authentication and authorization
- Integrate with external NBP API for exchange rate data
- Provide currency trading functionality with validation
- Store user data and transactions in SQLite database

### 1.3 Scope
The system includes:
- User registration and authentication
- Wallet management with PLN funding
- Real-time and historical exchange rate viewing
- Currency buy/sell transactions
- Transaction history tracking
- Multi-currency wallet balances

---

## 2. System Architecture

### 2.1 Architecture Overview
The system follows a three-tier architecture:
1. **Presentation Layer**: Mobile app (React Native/Expo)
2. **Business Logic Layer**: REST API (Node.js/Express)
3. **Data Layer**: SQLite database

### 2.2 Component Diagram
[Include component diagram showing Mobile App, REST API, Database, and NBP API]

### 2.3 Technology Stack
- **Mobile**: React Native 0.74.5, Expo SDK 51, React Navigation
- **Backend**: Node.js, Express 4.18.2
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **HTTP Client**: Axios

### 2.4 Network Architecture
- Backend server binds to 0.0.0.0:3010
- Mobile app auto-detects host IP with fallbacks
- Android emulator uses 10.0.2.2:3010
- Web version uses localhost:3010

---

## 3. Requirements Analysis

### 3.1 Functional Requirements
[Reference requirements.md for detailed list]

Key functional requirements:
- User authentication (register, login, logout)
- Wallet management and funding
- Exchange rate viewing (current and historical)
- Currency trading (buy/sell)
- Transaction history

### 3.2 Non-Functional Requirements
- Performance: API responses within 2 seconds
- Security: JWT tokens, password hashing
- Reliability: Graceful error handling
- Usability: Works on Android and Web
- Compatibility: Windows PowerShell support

### 3.3 Use Cases
[Reference usecase.puml diagram]

Main use cases:
1. User Registration
2. User Login
3. Fund Wallet
4. View Exchange Rates
5. View Historical Rates
6. Buy Currency
7. Sell Currency
8. View Transaction History

---

## 4. Design

### 4.1 Database Design
[Reference erd.mmd diagram]

**Entities**:
- **Users**: Stores user account information
- **Wallets**: Stores currency balances per user
- **Transactions**: Records all buy/sell/fund operations

**Relationships**:
- User has many Wallets (1:N)
- User has many Transactions (1:N)

### 4.2 API Design
[Include API endpoint documentation]

**Authentication**:
- POST /auth/register
- POST /auth/login

**Rates**:
- GET /rates/current
- GET /rates/history
- GET /rates/buy-sell

**Wallet**:
- GET /wallet/balances
- POST /wallet/fund

**Trading**:
- POST /trade/buy
- POST /trade/sell

**Transactions**:
- GET /transactions

### 4.3 Mobile App Design
[Reference class_mobile.puml diagram]

**Screens**:
- Login/Register (Authentication)
- Home (Overview)
- Rates (Current rates)
- History (Historical rates with chart)
- Trade (Buy/Sell)
- Wallet (Balances and funding)
- Settings (Logout, connection settings)
- About (Author information)

**Navigation**: Bottom tabs with stack navigation

### 4.4 Security Design
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Token-based authentication for protected endpoints
- Input validation on all endpoints
- SQL injection prevention via parameterized queries

---

## 5. Implementation

### 5.1 Backend Implementation

**Database Initialization**:
- SQLite database with better-sqlite3
- Automatic table creation on first run
- Demo user seeding

**API Endpoints**:
- Express routes organized by feature
- Middleware for authentication
- Error handling and validation

**NBP Integration**:
- Axios for HTTP requests
- Error handling for API failures
- Support for Table A (current rates) and Table C (buy/sell rates)

### 5.2 Mobile Implementation

**State Management**:
- React Context for authentication
- Local state for screen data
- AsyncStorage for token persistence

**Network Layer**:
- Auto IP detection using Expo Constants
- Fallback to manual configuration
- Axios client with JWT token injection

**UI Components**:
- React Native components
- Custom styling
- Simple chart implementation for history

### 5.3 Key Features

**Auto IP Detection**:
- Uses Expo Constants hostUri/debuggerHost
- Falls back to Android emulator address
- Manual override via Connection Settings

**Transaction Validation**:
- Checks sufficient balance before execution
- Atomic database transactions
- Clear error messages

**Historical Charts**:
- Simple line chart using React Native View components
- Displays rate trends over time

---

## 6. Testing

### 6.1 Manual Testing

**Authentication**:
- ✅ User registration
- ✅ User login
- ✅ JWT token validation
- ✅ Logout

**Wallet Operations**:
- ✅ Fund PLN wallet
- ✅ View balances
- ✅ Multi-currency support

**Exchange Rates**:
- ✅ Fetch current rates
- ✅ Search currencies
- ✅ View historical rates
- ✅ Display charts

**Trading**:
- ✅ Buy currency (with validation)
- ✅ Sell currency (with validation)
- ✅ Insufficient balance handling

**Transaction History**:
- ✅ View all transactions
- ✅ Correct ordering (newest first)

### 6.2 Network Testing
- ✅ Backend accessible on 0.0.0.0:3010
- ✅ Mobile app connects via auto-detected IP
- ✅ Web version works on localhost
- ✅ Connection settings override works

### 6.3 Platform Testing
- ✅ Android via Expo Go
- ✅ Web browser with phone-like UI
- ✅ Windows PowerShell compatibility

---

## 7. Deployment

### 7.1 Local Development Setup

**Prerequisites**:
- Node.js installed
- Expo Go app (for mobile)

**Setup Steps**:
1. Run `npm run setup`
2. Run `npm run dev`
3. Scan QR code with Expo Go or open web URL

### 7.2 Configuration
- Backend port: 3010
- Database: SQLite (local file)
- No environment variables required for basic setup

### 7.3 Known Limitations
- SQLite database is local (not suitable for production)
- JWT secret is hardcoded (should use environment variable)
- No rate limiting on API endpoints
- No HTTPS support (local development only)

---

## 8. Conclusion

### 8.1 Summary
The currency exchange system successfully implements all required features:
- Complete mobile application with intuitive UI
- RESTful backend API with NBP integration
- Secure authentication and transaction handling
- Comprehensive wallet and transaction management

### 8.2 Achievements
- ✅ All functional requirements met
- ✅ Works on Android and Web
- ✅ Auto IP detection with manual override
- ✅ Windows PowerShell compatible
- ✅ Zero-configuration database setup

### 8.3 Future Improvements
- Add more chart types and analytics
- Implement push notifications
- Add currency conversion calculator
- Support for more NBP tables
- Production-ready database (PostgreSQL)
- HTTPS support
- Rate limiting and API throttling
- Unit and integration tests

---

## 9. References

- NBP API Documentation: https://api.nbp.pl/
- Expo Documentation: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- Express.js: https://expressjs.com/
- SQLite: https://www.sqlite.org/

---

## Appendix A: API Endpoint Examples

[Include curl examples for all endpoints]

## Appendix B: Database Schema

[Include SQL schema]

## Appendix C: Screenshots

[Include screenshots of mobile app screens]
