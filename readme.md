# Personal Expense Tracker - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Module Architecture](#module-architecture)
6. [Core Features](#core-features)
7. [API Endpoints](#api-endpoints)
8. [Security Implementation](#security-implementation)
9. [Error Handling](#error-handling)
10. [Configuration](#configuration)
11. [Development & Deployment](#development--deployment)

---

## Project Overview

**Personal Expense Tracker** is a comprehensive backend API built with Node.js and Express that enables users to manage their personal finances through expense tracking, budget management, and financial analytics. The application provides user authentication, OTP-based verification, role-based access control, and comprehensive expense management capabilities.

### Key Objectives
- Provide secure user authentication and authorization
- Enable users to track personal expenses with categorization
- Manage budgets and monitor spending
- Generate financial reports
- Support multi-user management through admin dashboard

---

## Architecture & Structure

### Directory Layout

```
expense-tracker/
├── src/
│   ├── app.js                          # Express application entry point
│   ├── common/                         # Shared utilities and services
│   │   ├── enums/                      # Application enumerations
│   │   ├── errors/                     # Custom error classes
│   │   ├── hashingService/             # Password hashing service
│   │   ├── jwtService/                 # JWT token management
│   │   ├── mailer/                     # Email service configuration
│   │   └── middleware/                 # Shared middleware
│   ├── config/                         # Configuration files
│   │   └── db.config.js                # Database connection setup
│   ├── keys/                           # RSA keys for JWT signing
│   │   ├── private_key.pem             # Private key for token generation
│   │   └── public_key.pem              # Public key for token verification
│   ├── middlewares/                    # Express middlewares
│   │   ├── validation.middleware.js    # DTO validation middleware
│   │   ├── auth/                       # Authentication validation middlewares
│   │   ├── budget/                     # Budget-related validators
│   │   ├── expenses/                   # Expense-related validators
│   │   ├── roles/                      # Role-based access control
│   │   └── users/                      # User-related validators
│   ├── modules/                        # Feature modules (MVC Pattern)
│   │   ├── admin/                      # Admin functionality
│   │   ├── auth/                       # Authentication module
│   │   ├── budget/                     # Budget management module
│   │   ├── expenses/                   # Expense management module
│   │   ├── otp/                        # OTP service module
│   │   └── users/                      # User management module
│   └── routes/                         # API route handlers
├── package.json                        # Project dependencies
├── pnpm-lock.yaml                      # Locked dependency versions
└── TECHNICAL_DOCUMENTATION.md          # This file
```

### Architectural Pattern

The application follows a **layered architecture** with clear separation of concerns:

- **Routes Layer**: Defines API endpoints and request routing
- **Controllers Layer**: Handles HTTP requests and delegates business logic
- **Services Layer**: Contains business logic and orchestration
- **Repositories Layer**: Manages data access and database operations
- **Middleware Layer**: Handles cross-cutting concerns (validation, authentication, authorization)
- **Common Layer**: Provides shared utilities and services

---

## Technology Stack

### Backend Framework
- **Node.js**: JavaScript runtime for server-side execution
- **Express.js (v5.2.1)**: Web framework for building REST APIs

### Database
- **PostgreSQL**: Relational database management system
- **pg (v8.19.0)**: PostgreSQL client for Node.js

### Authentication & Security
- **bcrypt (v6.0.0)**: Password hashing library
- **jsonwebtoken (v9.0.3)**: JWT token generation and verification
- **RSA Encryption**: Public-private key cryptography for JWT signing

### Email Service
- **nodemailer (v8.0.4)**: Email delivery service
- **express-bearer-token (v3.0.0)**: Bearer token extraction middleware

### Validation
- **express-validator (v7.3.1)**: Request validation middleware

### Documentation
- **swagger-jsdoc (v6.2.8)**: OpenAPI/Swagger documentation generator
- **swagger-ui-express (v5.0.1)**: Swagger UI for API documentation

### Utilities
- **dotenv (v17.3.1)**: Environment variable management
- **exceljs (v4.4.0)**: Excel file generation for reports
- **crypto (v1.0.1)**: Cryptographic operations

### Development Tools
- **nodemon (v3.1.14)**: Auto-restart server during development

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id                SERIAL PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    email             VARCHAR(100) UNIQUE NOT NULL,
    password          VARCHAR(255) NOT NULL,
    phone             VARCHAR(20),
    profile_picture   VARCHAR(500),
    role              VARCHAR(20) DEFAULT 'USER',
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);
```

**Relationships**: Parent table for expenses, budgets, and OTP records

---

### Expenses Table
```sql
CREATE TABLE expenses (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(150) NOT NULL,
    amount     NUMERIC(10, 2) NOT NULL,
    category   VARCHAR(50) CHECK (category IN 
               ('Food', 'Transport', 'Shopping', 'Health', 
                'Entertainment', 'Bills', 'Others')),
    date       VARCHAR(20) NOT NULL,
    note       VARCHAR(300),
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Features**:
- Category constraint enforces predefined categories
- CASCADE deletion maintains referential integrity
- Numeric precision for accurate financial calculations

---

### Budgets Table
```sql
CREATE TABLE budgets (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_budget      NUMERIC(10, 2) NOT NULL,
    remaining_budget  NUMERIC(10, 2) NOT NULL,
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);
```

**Purpose**: Track budget allocation and remaining budget for users

---

### OTP Table
```sql
CREATE TABLE otps (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    code       VARCHAR(10) UNIQUE NOT NULL,
    purpose    VARCHAR(50) NOT NULL,
    attempts   INTEGER DEFAULT 0,
    is_used    BOOLEAN DEFAULT false,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**OTP Purposes**:
- `LOGIN`: OTP verification during login
- `RESET_PASSWORD`: OTP for password reset verification

---

## Module Architecture

### 1. Authentication Module (`/modules/auth/`)

**Purpose**: Handles user authentication, registration, login, and password management

**Components**:

#### Controllers
- **AuthenticationController**: Orchestrates authentication requests

#### Services
- **AuthenticationService**: Business logic for authentication operations
  - `registerUser()`: Create new user account
  - `login()`: Authenticate user and send OTP
  - `verifyUser()`: Verify OTP and issue tokens
  - `refreshToken()`: Generate new access token using refresh token
  - `forgetPassword()`: Initiate password reset process
  - `verifyOtpForReset()`: Verify OTP for password reset
  - `resetPassword()`: Update user password

#### DTOs (Data Transfer Objects)
- `LoginDto`: Login request validation
- `RegisterUserDto`: User registration request
- `RefreshTokenDto`: Token refresh request
- `ForgetPasswordDto`: Password reset request
- `ResetPasswordDto`: New password submission
- `VerifyOtpDto`: OTP verification request

---

### 2. User Management Module (`/modules/users/`)

**Purpose**: Manages user profiles, roles, and account operations

**Components**:

#### Controllers
- **UserController**: Handles user-related HTTP requests

#### Services
- **UserService**: User business logic
  - `createUser()`: Register new user
  - `getByEmail()`: Retrieve user by email
  - `getById()`: Fetch user details
  - `updateUser()`: Modify user information
  - `deleteUser()`: Remove user account

#### Repositories
- **UserRepository**: Database access layer for user operations

---

### 3. Expense Management Module (`/modules/expenses/`)

**Purpose**: Tracks and manages user expenses with categorization

**Components**:

#### Database Entity
- **Expense Schema**: Defines table structure with categories

#### Controllers
- **ExpenseController**: Handles expense-related requests

#### Services
- **ExpenseService**: Business logic for expense operations
  - `createExpense()`: Record new expense
  - `getExpenses()`: Retrieve all expenses with filtering
  - `getExpenseById()`: Fetch specific expense
  - `updateExpense()`: Modify expense details
  - `deleteExpense()`: Remove expense record
  - `getExpensesByCategory()`: Filter by category
  - `generateMonthlyReport()`: Create financial reports

#### Repositories
- **ExpenseRepository**: Data access for expense operations

#### DTOs
- `CreateExpenseDto`: Expense creation validation
- `UpdateExpenseDto`: Expense update validation
- `ExpenseResponseDto`: Standardized expense response format

---

### 4. Budget Management Module (`/modules/budget/`)

**Purpose**: Manages budget allocation and spending limits

**Components**:

#### Database Entity
- **Budget Schema**: Budget tracking structure

#### Controllers
- **BudgetController**: Handles budget requests

#### Services
- **BudgetService**: Budget business logic
  - `createBudget()`: Set up budget for user
  - `getBudget()`: Retrieve budget information
  - `updateBudget()`: Modify budget amounts
  - `calculateRemainingBudget()`: Compute available spending

#### Repositories
- **BudgetRepository**: Database operations for budgets

#### DTOs
- `CreateBudgetRequestDto`: Budget creation validation
- `UpdateBudgetRequestDto`: Budget update validation
- `BudgetResponseDto`: Standardized budget response

---

### 5. OTP Service Module (`/modules/otp/`)

**Purpose**: Manages one-time password generation and verification

**Components**:

#### Database Entity
- **OTP Schema**: OTP records table structure

#### Services
- **OtpService**: OTP operations
  - `generateOtp()`: Create 6-digit OTP
  - `sendOtp()`: Deliver OTP via email
  - `verifyAndConsume()`: Validate and mark OTP as used
  - `validateExpiry()`: Check OTP validity period

#### Repositories
- **OtpRepository**: Database access for OTP records

#### DTOs
- `VerifyOtpDto`: OTP verification request validation

---

### 6. Admin Module (`/modules/admin/`)

**Purpose**: Administrative functions and system management

**Components**:

#### Seeder
- **AdminSeeder**: Initialize default admin user on application startup

#### Repositories
- **AdminRepository**: Admin-specific database operations

---

## Core Features

### 1. User Authentication
- **Registration**: New user account creation with email verification
- **Login**: Email and password-based authentication with OTP verification
- **Token Management**: JWT tokens with RSA-256 signing for secure sessions
- **Refresh Token**: Extend session without re-authentication
- **Password Reset**: Secure password recovery via OTP verification

### 2. Expense Tracking
- **Expense Recording**: Create expenses with title, amount, category, date, and notes
- **Categorization**: Predefined categories (Food, Transport, Shopping, Health, Entertainment, Bills, Others)
- **Filtering & Search**: Retrieve expenses by date range, category, or user
- **Expense Management**: Update and delete expense records
- **Monthly Reports**: Generate expense summaries and trends

### 3. Budget Management
- **Budget Allocation**: Set monthly or custom budget limits
- **Budget Tracking**: Monitor spending against allocated budget
- **Remaining Balance**: Calculate available spending at any time
- **Budget Updates**: Adjust budget limits as needed

### 4. Email Notifications
- **OTP Delivery**: Send one-time passwords to user email
- **Account Alerts**: Notify users of account activities
- **Password Resets**: Email verification for password changes

### 5. Role-Based Access Control
- **User Roles**: USER, ADMIN roles with different permissions
- **Admin Dashboard**: Administrative functions for system management
- **Access Control**: Middleware-based role enforcement

### 6. Security Features
- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Authentication**: RSA-256 signed tokens for API security
- **Bearer Token**: Token-based authorization header validation
- **OTP Verification**: Multi-factor authentication support
- **Input Validation**: Request body validation using express-validator
- **Transaction Support**: Database transaction handling for data consistency

---

## API Endpoints

### Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and receive OTP | No |
| POST | `/auth/verify` | Verify OTP and get tokens | No |
| POST | `/auth/refresh` | Refresh access token | Yes |
| POST | `/auth/forget` | Initiate password reset | No |
| POST | `/auth/verifyotp` | Verify OTP for password reset | No |
| POST | `/auth/reset` | Reset password | No |

### User Endpoints (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get user profile | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| PUT | `/users/:id` | Update user profile | Yes |
| DELETE | `/users/:id` | Delete user account | Yes |
| POST | `/users` | Create new user (Admin) | Yes |

### Expense Endpoints (`/expenses`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/expenses` | Get all user expenses | Yes |
| GET | `/expenses/:id` | Get expense by ID | Yes |
| POST | `/expenses` | Create new expense | Yes |
| PUT | `/expenses/:id` | Update expense | Yes |
| DELETE | `/expenses/:id` | Delete expense | Yes |
| GET | `/expenses/category/:category` | Filter by category | Yes |
| GET | `/expenses/report/monthly` | Generate monthly report | Yes |

### Budget Endpoints (`/budget`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/budget` | Get user budget | Yes |
| POST | `/budget` | Create budget | Yes |
| PUT | `/budget/:id` | Update budget | Yes |
| DELETE | `/budget/:id` | Delete budget | Yes |

### Admin Endpoints (`/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/users` | Get all users | Yes (Admin) |
| GET | `/admin/analytics` | System analytics | Yes (Admin) |
| POST | `/admin/seed` | Seed initial data | Yes (Admin) |

### Health Check (`/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check endpoint |

---

## Security Implementation

### 1. Password Security
**Service**: `HashingService` (`common/hashingService/hashing.service.js`)

```javascript
async hashPassword(password, saltOrRounds = 10)
async comparePlainPass(plainPassword, hashedPassword)
```

- Uses bcrypt with configurable salt rounds (default: 10)
- Asynchronous operations prevent blocking
- One-way hashing prevents password visibility

### 2. JWT Authentication
**Service**: `JWTService` (`common/jwtService/jwt.service.js`)

**Token Types**:
- **Access Token**: Short-lived token for API requests (expires in configurable time)
- **Refresh Token**: Long-lived token for obtaining new access tokens

**Implementation Details**:
- RSA-256 (RS256) asymmetric signing algorithm
- Private key for token generation
- Public key for token verification
- Payload includes: `sub` (user ID), `email`, `role`, `type`

**Token Generation**:
```javascript
async generateAccessToken(id, email, role)
async generateRefreshToken(id, email, role)
```

### 3. Bearer Token Authentication
**Middleware**: `express-bearer-token`

- Extracts bearer token from Authorization header
- Validates token presence and format
- Attached to `req.token` for downstream use

### 4. OTP Verification
**Service**: `OtpService` (`modules/otp/services/`)

- Random 6-digit OTP generation
- Email delivery verification
- Expiration time enforcement (typically 10-15 minutes)
- Single-use consumption prevents reuse
- Attempt tracking prevents brute force attacks

### 5. Role-Based Access Control
**Middleware**: `CheckRoleMiddleware` (`middlewares/roles/check-role.middleware.js`)

- Verifies user role from JWT payload
- Enforces endpoint-level access control
- Supports multiple roles per endpoint

### 6. Input Validation
**Middleware Layer**: `validation.middleware.js`

- Express-validator for request body validation
- DTO-based validation rules
- Prevents invalid data entry
- Sanitizes input to prevent injection attacks

### 7. Environment Variables
**Configuration**: `.env` file (not included in repository)

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=expense_tracker
PORT=3000
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

---

## Error Handling

### Custom Error Classes
Located in `/common/errors/`:

#### 1. **ValidationError** (`validate-integer-values.error.js`)
- Thrown when input validation fails
- HTTP Status: 400 Bad Request

#### 2. **NotExistError** (`not-exist.error.js`)
- Thrown when requested resource not found
- HTTP Status: 404 Not Found

### Error Handling Pattern

```javascript
try {
    // Business logic
} catch (error) {
    if (error instanceof NotExistError) {
        return res.status(404).json({ message: error.message });
    }
    if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
    }
    // Generic error response
    return res.status(500).json({ message: 'Internal Server Error' });
}
```

### Database Transaction Error Handling
**Function**: `withTransaction()` in `config/db.config.js`

- Automatic rollback on error
- Maintains data consistency
- Releases database connections properly

---

## Configuration

### Application Configuration Files

#### 1. **Database Configuration** (`src/config/db.config.js`)
- PostgreSQL connection pooling
- Automatic table creation on startup
- Transaction support with rollback

#### 2. **Environment Configuration** (`.env`)
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=expense_tracker

# Server
PORT=3000

# JWT
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Application
NODE_ENV=development
```

#### 3. **Swagger Configuration** (`src/app.js`)
- OpenAPI 3.0.0 specification
- Endpoint documentation at `/api-docs`
- Automatic API schema generation from JSDoc comments

---

## Development & Deployment

### Installation & Setup

```bash
# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Generate JWT keys (if not present)
ssh-keygen -t rsa -b 2048 -m pem -f src/keys/private_key.pem -N ""
openssl rsa -in src/keys/private_key.pem -pubout -out src/keys/public_key.pem
```

### Running the Application

#### Development Mode (with auto-reload)
```bash
pnpm run dev
```

#### Production Mode
```bash
pnpm start
```

### Database Setup

The application automatically creates all required tables on startup:
1. Users table
2. Expenses table
3. OTP table
4. Budgets table

### Scripts Available

| Script | Command | Purpose |
|--------|---------|---------|
| Start | `pnpm start` | Run production server |
| Dev | `pnpm run dev` | Run development server with auto-reload |

### API Documentation
Access Swagger UI at: `http://localhost:3000/api-docs`

### Database Schema Initialization

Tables are created automatically in the following order:
1. **users**: Parent table for other entities
2. **expenses**: Depends on users
3. **otps**: Depends on users
4. **budgets**: Depends on users

### Admin Seeding
On application startup, the `AdminSeeder` creates default admin user:
- **Email**: admin@example.com (configurable)
- **Role**: ADMIN
- **Purpose**: System administration and analytics

---

## Middleware Pipeline

### Request Flow
```
1. Express JSON Parser
2. Bearer Token Extraction
3. Route Matching
4. Input Validation Middleware (DTO validators)
5. Authentication Check (if required)
6. Authorization Check (if required)
7. Controller Handler
8. Service Layer Processing
9. Repository Database Operations
10. Response Formatting
```

### Available Middlewares

#### Authentication
- **`auth.middleware.js`**: Verifies JWT token validity
- **`validate-login-request-dto.middleware.js`**: Validates login payload
- **`validate-register-user.dto.js`**: Validates registration payload
- **`validate-refresh-token-dto.middleware.js`**: Validates token refresh request
- **`validate-verifyotp-middleware.js`**: Validates OTP verification request
- **`validate-forget-password-dto.middleware.js`**: Validates password reset initiation
- **`validate-reset-password.dto.js`**: Validates new password submission

#### Authorization
- **`check-role.middleware.js`**: Enforces role-based access control

#### Resource Validation
- **`validate-create-expense-dto.middleware.js`**: Expense creation validation
- **`validate-update-expense-dto.middleware.js`**: Expense update validation
- **`validate-create-budget-dto.middleware.js`**: Budget creation validation
- **`validate-update-budget-dto.middleware.js`**: Budget update validation
- **`validate-create-user-dto.middleware.js`**: User creation validation (Admin)
- **`validate-update-user-dto.middleware.js`**: User update validation

---

## Data Flow Example: User Login

```
1. POST /auth/login
   ├─ Body: { email, password }
   ├─ Validation Middleware: Validate DTO
   ├─ AuthController.logIn()
   │   ├─ AuthService.login()
   │   │   ├─ UserService.getByEmail()
   │   │   │   └─ UserRepository.findByEmail()
   │   │   │       └─ Database Query
   │   │   ├─ HashingService.comparePlainPass()
   │   │   └─ OtpService.sendOtp()
   │   │       ├─ OTP Generation
   │   │       ├─ Email Service Delivery
   │   │       └─ OTP Database Storage
   │   └─ Response: "OTP sent successfully"
   
2. POST /auth/verify
   ├─ Body: { email, code }
   ├─ Validation Middleware: Validate DTO
   ├─ AuthController.verify()
   │   ├─ AuthService.verifyUser()
   │   │   ├─ UserService.getByEmail()
   │   │   ├─ OtpService.verifyAndConsume()
   │   │   ├─ JWTService.generateAccessToken()
   │   │   └─ JWTService.generateRefreshToken()
   │   └─ Response: { accessToken, refreshToken }
```

---

## Performance Considerations

### Database Optimization
- Connection pooling reduces overhead
- Indexes on frequently queried fields (email, user_id)
- Foreign key relationships with cascade deletion
- Transaction support prevents partial updates

### Scalability
- Stateless API design allows horizontal scaling
- JWT authentication without server-side sessions
- Database connection pooling handles concurrent requests
- Async/await pattern for non-blocking operations

### Security Best Practices
- RSA-256 signed JWTs prevent token tampering
- Password hashing with bcrypt prevents rainbow table attacks
- OTP expiration prevents brute force attempts
- Role-based access control restricts unauthorized access
- Input validation prevents injection attacks

---

## Future Enhancements

### Planned Features
- [ ] Two-factor authentication (2FA)
- [ ] Advanced reporting with charts and analytics
- [ ] Budget alerts and notifications
- [ ] Recurring expenses
- [ ] Expense splitting between users
- [ ] Multi-currency support
- [ ] Mobile app integration
- [ ] Export reports to PDF/Excel

### Potential Improvements
- [ ] Implement caching layer (Redis)
- [ ] Add API rate limiting
- [ ] Implement audit logging
- [ ] Add unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Database migration system
- [ ] API versioning

---

## Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: Cannot connect to database
Solution: 
- Verify PostgreSQL is running
- Check DB credentials in .env
- Ensure database exists
```

#### JWT Key Files Missing
```
Error: ENOENT: no such file or directory ... private_key.pem
Solution:
- Generate keys: ssh-keygen -t rsa -b 2048 -m pem -f src/keys/private_key.pem -N ""
- Create public key: openssl rsa -in src/keys/private_key.pem -pubout -out src/keys/public_key.pem
```

#### Email Service Not Working
```
Error: Failed to send OTP email
Solution:
- Verify email credentials in .env
- Enable "Less secure app access" for Gmail
- Use app-specific password for Gmail accounts
```

---

## Conclusion

This Personal Expense Tracker application demonstrates a robust, secure, and scalable Node.js backend architecture. The implementation follows industry best practices including layered architecture, comprehensive error handling, security measures, and clear separation of concerns. The system provides a solid foundation for personal finance management and can be extended with additional features as requirements evolve.

---

**Document Version**: 1.0  
**Last Updated**: May 5, 2026  
**Maintained By**: Development Team
