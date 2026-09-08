# Personal Expense Tracker - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Directory Structure](#architecture--directory-structure)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Module Architecture](#module-architecture)
6. [Core Features](#core-features)
7. [API Endpoints](#api-endpoints)
8. [Security & Authentication](#security--authentication)
9. [Error Handling](#error-handling)
10. [Configuration & Environment](#configuration--environment)
11. [Development & Setup](#development--setup)

---

## Project Overview

**Personal Expense Tracker** (Vault Finance Backend) is a robust RESTful API built with **Node.js**, **Express v5**, and **PostgreSQL**. It provides comprehensive personal financial management features including expense tracking, budget allocation, Excel report downloads, multi-factor authentication (OTP via email & Google OAuth2), token revocation via token versioning, and administrative user controls.

### Key Objectives
- Secure multi-method authentication (Email/Password + OTP & Google OAuth2).
- JWT Token management with RSA-256 public/private key signing and instant logout token revocation.
- Personal expense logging with categorization (*Food, Transport, Shopping, Health, Entertainment, Bills, Others*).
- Budget limits with automatic spending deduction and balance calculation.
- Exporting expense and user data in Excel (`.xlsx`) format.
- Admin dashboard APIs for managing system users and monitoring total financial activity.

---

## Architecture & Directory Structure

The application follows a **layered modular (MVC) architecture**:

```
expense-tracker-backend/
├── src/
│   ├── app.js                          # Express application entry point
│   ├── common/                         # Shared cross-cutting modules
│   │   ├── enums/                      # Application enums (Roles, OtpPurpose)
│   │   ├── errors/                     # Custom error handlers (notExists, validateIntegerValues)
│   │   ├── hashingService/             # Password hashing service (bcrypt)
│   │   ├── jwtService/                 # JWT token generation & verification (RS256)
│   │   └── mailer/                     # Email delivery service & HTML templates
│   ├── config/                         # Configuration files
│   │   ├── db.config.js                # PostgreSQL connection pool & transaction helper
│   │   └── passport.js                 # Google OAuth Strategy configuration
│   ├── keys/                           # RSA Keys for JWT signing
│   │   ├── private_key.pem             # Private key (for token signing)
│   │   └── public_key.pem              # Public key (for token verification)
│   ├── middlewares/                    # Custom Express middlewares
│   │   ├── validation.middleware.js    # DTO validation handler
│   │   ├── auth/                       # Bearer token verification middleware
│   │   ├── budget/                     # Budget request validators
│   │   ├── expenses/                   # Expense request validators
│   │   ├── roles/                      # Role-based access control (RBAC)
│   │   └── users/                      # User management request validators
│   ├── modules/                        # Feature modules
│   │   ├── admin/                      # Admin seeder & repository
│   │   ├── auth/                       # Authentication controllers, services & DTOs
│   │   ├── budget/                     # Budget management module
│   │   ├── expenses/                   # Expense management module
│   │   ├── otp/                        # OTP service & repository
│   │   └── users/                      # User management module
│   └── routes/                         # API route declarations
│       ├── admin.route.js              # Admin endpoints
│       ├── auth.route.js               # Authentication & OAuth routes
│       ├── budget.route.js             # Budget endpoints
│       ├── expense.route.js            # Expense endpoints
│       └── user.route.js               # Profile user endpoints
├── .env                                # Environment variable configuration
├── package.json                        # Node dependencies & npm scripts
└── readme.md                           # Technical documentation
```

---

## Technology Stack

### Core Framework & Server
- **Node.js** (v18+)
- **Express.js** (`^5.2.1`): Web framework

### Database & Storage
- **PostgreSQL**: Relational database engine
- **pg** (`^8.19.0`): PostgreSQL client pool

### Security & Authentication
- **Passport.js** (`^0.7.0`) & **passport-google-oauth20** (`^2.0.0`): Google OAuth2 authentication
- **jsonwebtoken** (`^9.0.3`): JWT with RS256 asymmetric signing
- **bcrypt** (`^6.0.0`): Password hashing
- **express-bearer-token** (`^3.0.0`): Header token extraction

### Email & Communication
- **nodemailer** (`^8.0.4`): SMTP Email service for sending OTP codes

### File Generation & Validation
- **exceljs** (`^4.4.0`): Excel spreadsheet exporter (`.xlsx`)
- **express-validator** (`^7.3.1`): Request body DTO validation

---

## Database Schema

### 1. Users Table (`users`)
```sql
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(50) NOT NULL UNIQUE,
    password        TEXT,
    google_id       VARCHAR(255) UNIQUE,
    role            VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active       BOOLEAN DEFAULT FALSE NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW(),
    token_version   INT DEFAULT 1 NOT NULL
);
```

### 2. Expenses Table (`expenses`)
```sql
CREATE TABLE IF NOT EXISTS expenses (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(150) NOT NULL,
    amount     NUMERIC(10, 2) NOT NULL,
    category   VARCHAR(50) CHECK (category IN 
               ('Food', 'Transport', 'Shopping', 'Health', 
                'Entertainment', 'Bills', 'Others')),
    date       VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Budgets Table (`budgets`)
```sql
CREATE TABLE IF NOT EXISTS budgets (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_budget      NUMERIC(10, 2) NOT NULL,
    remaining_budget  NUMERIC(10, 2) NOT NULL,
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);
```

### 4. OTP Table (`otps`)
```sql
CREATE TABLE IF NOT EXISTS otps (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    code       VARCHAR(10) NOT NULL,
    purpose    VARCHAR(50) NOT NULL,
    email      VARCHAR(100) NOT NULL,
    attempts   INTEGER DEFAULT 0,
    isUsed     BOOLEAN DEFAULT FALSE,
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Core Features

1. **User Authentication & OTP Verification**:
   - Registration triggers initial user creation.
   - Login sends a 6-digit OTP code to the user's email.
   - Verifying OTP activates inactive accounts and issues access & refresh tokens.
   - Google OAuth2 endpoint allows one-click social authentication.
2. **Token Revocation (Logout)**:
   - Calling `/api/v1/auth/logout` increments `token_version` in the database.
   - Any refresh tokens issued prior to logout immediately become invalid.
3. **Expense Management**:
   - Create, view, update, and delete expenses.
   - Expense creation automatically deducts amount from user's remaining budget inside a database transaction (`withTransaction`).
   - Export expense list to Excel (`.xlsx`).
4. **Budget Allocation**:
   - Define total spending limits and monitor remaining budget in real-time.
5. **Admin Capabilities**:
   - View system user directory and filter users by ID or Email.
   - Activate/Deactivate users and export user lists to Excel (`.xlsx`).
   - Monitor total system financial transactions.

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### 🔑 Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user account | No |
| `POST` | `/auth/login` | Validate password & trigger OTP email | No |
| `POST` | `/auth/verify` | Verify OTP code & return Access/Refresh tokens | No |
| `POST` | `/auth/refresh` | Issue new Access token via Refresh token | No |
| `POST` | `/auth/forget` | Send OTP for password reset | No |
| `POST` | `/auth/verifyotp` | Verify OTP code for password reset | No |
| `POST` | `/auth/reset` | Submit new password with reset token | No |
| `POST` | `/auth/logout` | Revoke current tokens (increments `token_version`) | Yes |
| `GET` | `/auth/google` | Initiate Google OAuth2 authentication | No |
| `GET` | `/auth/google/callback` | Google OAuth2 callback redirect handler | No |

### 👤 Profile User Routes (`/users`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Fetch authenticated user profile | Yes |
| `PATCH` | `/users/me` | Update authenticated user profile | Yes |
| `DELETE` | `/users/me` | Delete authenticated user account | Yes |

### 💸 Expense Routes (`/expenses`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/expenses/` | Create a new expense | Yes |
| `GET` | `/expenses/user/me` | Fetch all expenses for logged-in user | Yes |
| `GET` | `/expenses/me/:id` | Fetch specific expense by ID | Yes |
| `GET` | `/expenses/downloadxlsx` | Download expense report in `.xlsx` format | Yes |
| `PATCH` | `/expenses/:id` | Update expense details | Yes |
| `DELETE` | `/expenses/:id` | Delete expense record | Yes |

### 🎯 Budget Routes (`/budget`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/budget/` | Create initial user budget | Yes |
| `GET` | `/budget/me` | Retrieve current user budget | Yes |
| `PATCH` | `/budget/me` | Top-up or update total budget amount | Yes |
| `DELETE` | `/budget/me` | Delete budget allocation | Yes |

### 👑 Admin Routes (`/admin`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | Retrieve all registered users | Admin |
| `GET` | `/admin/users/downloadusersxlsx` | Export all users to Excel (`.xlsx`) | Admin |
| `GET` | `/admin/users/email` | Find user by email query | Admin |
| `GET` | `/admin/users/:id` | Find user by ID | Admin |
| `POST` | `/admin/users` | Create user account via admin | Admin |
| `PATCH` | `/admin/users/:id` | Update user details via admin | Admin |
| `PATCH` | `/admin/users/:id/deactivate` | Deactivate user account | Admin |
| `DELETE` | `/admin/users/:id` | Delete user account via admin | Admin |
| `GET` | `/admin/expenses/alltransactions` | Sum of total system transactions | Admin |
| `GET` | `/admin/expensesall/:userId` | Get expenses for a specific user ID | Admin |
| `GET` | `/admin/expenses/:id` | Get expense record by ID | Admin |

---

## Security & Authentication

### RS256 Asymmetric JWT Tokens
- Tokens are signed using an **RSA 2048-bit Private Key** (`src/keys/private_key.pem`) and verified with the **Public Key** (`src/keys/public_key.pem`).
- Access Tokens expire in **15 minutes**.
- Refresh Tokens include `tokenVersion`.

### Token Revocation via `token_version`
- When a user logs out, the database increments `token_version` via:
  ```sql
  UPDATE users SET token_version = COALESCE(token_version, 1) + 1 WHERE id = $1
  ```
- Any token presented with an older `tokenVersion` is automatically rejected during refresh.

---

## Development & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database server running locally or remotely

### Environment Setup (`.env`)

Create a `.env` file in the project root:

```env
PORT=3000

# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
DB_NAME=expense_tracker

# JWT
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_RESET_EXPIRES_IN=15m

# SMTP Email
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Default Admin Seeder
FIRSTNAME=Muhammad
LASTNAME=Tariq
EMAIL=admin@example.com
PASSWORD=Change_Me_123

# Google OAuth2
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
CORS_ORIGIN=http://localhost:5173
```

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run in Development Mode (Nodemon)
npm run dev

# 3. Run in Production Mode
npm start
```
