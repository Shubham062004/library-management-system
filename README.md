# LuminaLib — Production-Grade Library Management System

LuminaLib is an enterprise-grade, full-stack, and dockerized Library Management System designed for high performance, modular scalability, and simple deployments. It integrates a sleek, responsive React dashboard built with TypeScript and Tailwind CSS with a secure, highly-performant Node.js & Express REST API using Prisma ORM and a PostgreSQL database.

## 🚀 Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS (Axios, React Router v6, Lucide Icons)
- **Backend**: Node.js + Express + TypeScript (Helmet security, CORS, Morgan logger, Dotenv)
- **Database**: PostgreSQL (Prisma ORM for migrations and type-safe database queries)
- **DevOps**: Docker + Docker Compose (Multi-stage efficient Alpine build layers)
- **Code Quality**: ESLint, Prettier, strict TypeScript configs, robust global error handling, and clean modular routers.

---

## 📂 Project Architecture

```text
library-management-system/
│
├── frontend/             # Single-Page React Web Application
│   ├── src/
│   │   ├── api/          # Axios instance and endpoints
│   │   ├── assets/       # Visual media assets and globally loaded icons
│   │   ├── components/   # Reusable UI elements (inputs, buttons, overlays)
│   │   ├── context/      # React Context (AuthProvider session state)
│   │   ├── hooks/        # Custom React hooks (forms, fetches, states)
│   │   ├── layouts/      # Sidebar and top-bar layout configurations
│   │   ├── pages/        # Dashboard, Books, Members, and Transaction views
│   │   ├── routes/       # Path routing managers
│   │   ├── services/     # Logical abstraction for state managers
│   │   ├── types/        # TypeScript models and interfaces
│   │   └── utils/        # Generic helper functions
│   ├── Dockerfile        # Production multi-stage client build
│   └── tailwind.config.js# Tailwind visual design token config
│
├── backend/              # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/       # Environment loading modules
│   │   ├── controllers/  # Route handler controllers (business logic)
│   │   ├── middleware/   # Helmet, CORS, loggers, error middleware
│   │   ├── models/       # Virtual data models or custom validators
│   │   ├── modules/      # Feature-isolated modules (e.g. member)
│   │   ├── prisma/       # Client singleton connection service
│   │   ├── routes/       # Modular path routers
│   │   ├── services/     # Third-party adapters and transactional logic
│   │   └── types/        # Shared server type contracts
│   ├── prisma/           # Database migration files and client schemas
│   │   └── schema.prisma # Datasources, clients, models
│   └── Dockerfile        # Highly optimized multi-stage build running Alpine
│
├── docs/                 # Product specifications and architecture designs
├── docker/               # Auxiliary scripts and volume mounts
├── .github/              # Automation and CI/CD workflow actions
├── docker-compose.yml    # Monorepo container orchestrator
└── README.md             # Systems documentation manual
```

---

## ⚙️ Monorepo Quickstart Setup

To get LuminaLib running locally, verify you have [Node.js v20+](https://nodejs.org/) and [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

### 1. Clone & Branch Verification
Ensure you are operating on the initial feature branch:
```bash
git clone https://github.com/Shubham062004/library-management-system.git
cd library-management-system
git checkout develop
git checkout feature/project-setup
```

### 2. Configure Environment Variables
Create localized environment files for both microservices from the templates:
```bash
# Set up root environment variables
cp .env.example .env

# Set up backend environment variables
cp backend/.env.example backend/.env

# Set up frontend environment variables
cp frontend/.env.example frontend/.env
```

---

## 🐋 Running via Docker (Recommended)

Spins up PostgreSQL, compiles backend TypeScript, bundles the React application inside Nginx, and exposes the services cleanly.

```bash
# Build and run the entire local development stack in the foreground (recommended for logs)
docker compose up --build

# Or build and run in detached background mode
docker compose up --build -d

# Verify container statuses and health states
docker compose ps
```

Services are exposed at the following endpoints:
- **React Frontend Dashboard**: [http://localhost:5173](http://localhost:5173) (With HMR hot-reloading fully active)
- **REST API Server**: [http://localhost:5000](http://localhost:5000)
- **PostgreSQL Database**: `localhost:5432`

---

## 🛠️ Running Services Locally for Active Development (Outside Docker)

### 1. Backend Server Setup
Navigate into the `backend/` directory, install packages, and boot the server:
```bash
cd backend
npm install
npm run dev
```
Open [http://localhost:5000/health](http://localhost:5000/health) to verify status. You should receive:
```json
{
  "success": true,
  "message": "Server running successfully"
}
```

---

## 🗄️ Relational Database Architecture & Workflow

LuminaLib utilizes a normalized PostgreSQL layout managed using Prisma ORM.

### 📊 Database Relational Map
```text
  Member (1) ─── borrow history ─── (Many) Issuance (Many) ─── inventory check ─── (1) Book
```

- **Member**: Handles cardholder information (unique `email`, registration `membershipDate`).
- **Book**: Handles available publications (unique `isbn`, inventory `quantity`, tracked `availableQuantity`).
- **Issuance**: Links members with borrowed books, storing dates (`issueDate`, `targetReturnDate`, nullable `actualReturnDate`) and native `IssuanceStatus` states (`ISSUED`, `RETURNED`).

---

### ⚙️ Prisma Database CLI Commands

Execute these workflows within the `backend/` directory:

```bash
# 1. Compile Schema to TypeScript Typings
npx prisma generate

# 2. Sync Schema to PostgreSQL Database & Create Migration
npx prisma migrate dev --name init

# 3. Seed Database with Sample Items (10 members, 20 books, 7 transactions)
npm run seed

# 4. Boot Up Prisma Visual Studio Database Explorer
npx prisma studio
```

---

### 2. Frontend React Setup
Open a second terminal window, install packages, and boot Vite's dev server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔍 Troubleshooting & HMR Watch Polling

### 1. Hot Module Replacement (HMR) Fails to Trigger
If you are developing inside a WSL/Windows environment and code modifications do not compile instantly inside your React container, verify that Vite is configured to use polling. In `frontend/vite.config.ts`, we enforce:
```ts
server: {
  host: true,
  watch: {
    usePolling: true
  }
}
```
This bypasses Linux `inotify` block limits across virtual filesystems.

### 2. Backend fails to connect to Database
If the backend logs show connection timeout errors:
- Ensure the PostgreSQL database container has reached a `healthy` state before the backend starts up. Docker Compose handles this via a `healthcheck` in `docker-compose.yml`:
```yaml
depends_on:
  postgres:
    condition: service_healthy
```
- Verify that `DATABASE_URL` in your `.env` refers to `postgres` as the hostname (e.g., `postgresql://postgres:postgres@postgres:5432/...`) inside Docker, whereas local runs outside containers must use `localhost` (e.g., `postgresql://postgres:postgres@localhost:5432/...`).

---

## 📖 Interactive OpenAPI/Swagger Documentation

LuminaLib incorporates a production-grade **OpenAPI 3.0** documentation suite built using `swagger-ui-express` and `swagger-jsdoc` to promote API discoverability and frictionless developer onboarding.

### 🌐 Accessing the Docs Portal
Boot up the stack (via Docker or local runtime) and open your browser to:
- **Interactive Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### 🔑 Dynamic JWT Authorization inside Swagger
To execute and test private/protected API endpoints directly from your browser:
1. Open the `/auth/login` endpoint accordion under the **Auth** tag.
2. Click **Try it out** and execute the request with the seeded admin details:
   ```json
   {
     "email": "admin@library.com",
     "password": "password123"
   }
   ```
3. Copy the returned secure JWT token string from the response payload (`data.token`).
4. Scroll to the top of the page, click the green **Authorize** button.
5. Paste your copied token inside the value field, and click **Authorize**.
6. Perfect! All protected accordions (Members, Books, Issuances, and Analytics) are now authenticated. You can run dynamic commands directly inside the Swagger interface!

### 📂 Modular Documentation Architecture
LuminaLib organizes OpenAPI components cleanly under `backend/src/docs/` to avoid bloated route controllers:
- `swagger.ts`: Registers root configurations, servers, info metadata, and the `bearerAuth` security scheme.
- `schemas/`: Defines reusable components schemas mapping models, input validations, standard responses, and validation/conflict errors.
- `examples/`: Configures realistic payload objects for rapid testing mockups.
- `paths/`: Modularizes route definitions, queries, path variables, responses, and authorization boundaries by domain tag.

---

## 🔒 Authentication & API Security Architecture

LuminaLib implements a stateless, token-based security architecture using JSON Web Tokens (JWT) and cryptographic hashing.

### 🔑 Authentication Flow Map
```text
  Client Login (POST /auth/login) ──> bcrypt verify ──> Sign JWT Token ──> Client Stores Token
                                                                                │
  Client Protected API request ──> Pass Bearer Token Header ──> JWT Middleware ──> Access Granted (GET /auth/me)
```

- **JWT Expiration**: Tokens expire in `1d` (configurable via `JWT_EXPIRES_IN`).
- **Cryptographic Security**: Passwords are saved as secure salt hashes using **bcrypt** with a default salt round factor of `10`.
- **IP Rate Limiting**: Prevents automated brute-force attacks by limiting login requests to a maximum of `100` attempts per `15` minutes per IP.
- **Helmet Headers**: Enforces strict security configurations (HSTS, Content Security Policies) on every server response.

---

## 💻 Frontend Architecture & Session Security

LuminaLib utilizes a highly scalable, component-based frontend architecture built on **React v19**, **Vite**, **TypeScript**, and styled with **Tailwind CSS**. It implements secure, token-based session management.

### 🔑 Frontend Session Lifecycle Map
```text
  User Login (POST /auth/login) ──> Set localStorage('token') ──> React Context AuthState Updated
                                                                               │
  Load Admin Portal (GET /auth/me) ──> Axios Request Interceptor ──> Verify JWT and load Profile
                                                                               │
  API 401 Unauth error response ──> Axios Response Interceptor ──> Clear local storage & Redirect to /login
```

### 🛡️ Core Architectural Components
1. **React Context AuthProvider (`AuthContext.tsx`)**
   - Serves as the central repository for session state, validating credentials on mount, managing administrator profile parameters (`/auth/me`), caching raw token credentials, and resetting memory trees during sign-out.
2. **Axios Client Interceptors (`axios.ts`)**
   - **Request Interceptor**: Scans cache storage for stored JWT strings and automatically injects them into the HTTP headers (`Authorization: Bearer <token>`) of outgoing requests.
   - **Response Interceptor**: Captures incoming failures. If the backend returns `401 Unauthorized` (e.g. token expired or revoked), the interceptor automatically flushes user state and redirects the browser to `/login`.
3. **Reactive Route Guards (`ProtectedRoute` & `PublicRoute`)**
   - **`<ProtectedRoute>`**: Guards restricted dashboards and panels, evaluating authentication states before displaying elements. Blocks and redirects anonymous queries to `/login`.
   - **`<PublicRoute>`**: Safeguards authentication pages like `/login` from logged-in administrators, automatically redirecting them to the core portal view (`/`).
4. **Visually Stunning Admin Panel**
   - Implements beautiful responsive layout structures (sidebar navigations, sticky headers, profile footers) that adjust to Desktop, Tablet, and Mobile resolutions.
   - Displays real-time data visualizers (weekly borrow trend charts), customized action blocks (task triggers), skeleton preloading blocks, and robust empty/error screens.

---

### 📡 Security & REST API Endpoints

All secure endpoints require the **Bearer JWT** authorization header: `Authorization: Bearer <token>`

| Method | Endpoint | Description | Auth Requirement |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Authenticate admin & acquire JWT | Public (Zod validated) |
| **GET** | `/auth/me` | Fetch authenticated user profile | Bearer Token Required |
| **POST** | `/members` | Create a new library cardholder | Bearer Token Required (Zod validated) |
| **GET** | `/members` | List members (supports page/search/sorting) | Bearer Token Required |
| **GET** | `/members/:id` | Fetch specific cardholder by UUID | Bearer Token Required |
| **PUT** | `/members/:id` | Update cardholder details | Bearer Token Required (Zod validated) |
| **POST** | `/books` | Create a new book catalog | Bearer Token Required (Zod validated) |
| **GET** | `/books` | List books (supports page/search/sorting/filters) | Bearer Token Required |
| **GET** | `/books/:id` | Fetch specific book by UUID | Bearer Token Required |
| **PUT** | `/books/:id` | Update book details and inventory | Bearer Token Required (Zod validated) |
| **POST** | `/issuances` | Issue a book to a member | Bearer Token Required (Zod validated) |
| **GET** | `/issuances` | List issuance records with filters | Bearer Token Required |
| **GET** | `/issuances/outstanding` | List outstanding unreturned borrows | Bearer Token Required |
| **GET** | `/issuances/overdue` | List overdue active borrows | Bearer Token Required |
| **GET** | `/issuances/:id` | Fetch specific issuance details | Bearer Token Required |
| **PUT** | `/issuances/:id/return` | Return a borrowed book | Bearer Token Required |
| **GET** | `/analytics/stats` | Fetch general library stats summary | Bearer Token Required |
| **GET** | `/analytics/overdue-summary` | Fetch active past-deadline borrows by member | Bearer Token Required |
| **GET** | `/analytics/books/never-borrowed` | Fetch list of books never borrowed | Bearer Token Required |
| **GET** | `/analytics/books/outstanding` | Fetch outstanding borrowed books | Bearer Token Required |
| **GET** | `/analytics/books/top-borrowed` | Fetch top 10 most borrowed books | Bearer Token Required |

---

### 📝 API Usage & JSON Payloads Examples

#### 1. Public Authentication (`POST /auth/login`)
- **Request Payload**:
```json
{
  "email": "admin@library.com",
  "password": "password123"
}
```
- **Response Payload**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Create Library Member (`POST /members`)
- **Request Payload**:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210"
}
```
- **Response Payload**:
```json
{
  "success": true,
  "message": "Member created successfully",
  "data": {
    "id": "e2a392ab-9d8a-40a2-aa59-873cf106b3e6",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "9876543210",
    "membershipDate": "2026-05-28T00:00:00.000Z",
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z"
  }
}
```

#### 3. List Members with Filters (`GET /members`)
Supports query parameters:
* `page`: Page index (defaults to `1`)
* `limit`: Page count (defaults to `10`)
* `search`: Matches substrings in `name` or `email` case-insensitively
* `sortBy`: Field to sort on (`name`, `email`, `membershipDate`, `createdAt`)
* `sortOrder`: Sorting direction (`asc` or `desc`)

- **Example Query**: `GET /members?page=1&limit=10&search=rahul&sortBy=name&sortOrder=asc`
- **Response Payload**:
```json
{
  "success": true,
  "message": "Members retrieved successfully",
  "data": {
    "members": [
      {
        "id": "e2a392ab-9d8a-40a2-aa59-873cf106b3e6",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "phone": "9876543210",
        "membershipDate": "2026-05-28T00:00:00.000Z"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

#### 4. Update Library Member (`PUT /members/:id`)
- **Request Payload**:
```json
{
  "name": "Rahul Sharma Updated",
  "phone": "9999988888"
}
```
- **Response Payload**:
```json
{
  "success": true,
  "message": "Member updated successfully",
  "data": {
    "id": "e2a392ab-9d8a-40a2-aa59-873cf106b3e6",
    "name": "Rahul Sharma Updated",
    "email": "rahul@example.com",
    "phone": "9999988888"
  }
}
```

#### 5. Register Book (`POST /books`)
- **Request Payload**:
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "isbn": "9780735211292",
  "quantity": 10,
  "availableQuantity": 10
}
```
- **Response Payload**:
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": "7ac19532-6804-4b57-a9a7-47b2ea1a243e",
    "title": "Atomic Habits",
    "author": "James Clear",
    "isbn": "9780735211292",
    "quantity": 10,
    "availableQuantity": 10,
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z"
  }
}
```

#### 6. List Books (`GET /books`)
Supports query parameters:
* `page`: page index (default: `1`)
* `limit`: records limit (default: `10`)
* `search`: filters across `title`, `author`, and `isbn` (case-insensitive substring match)
* `sortBy`: field to sort by (`title`, `author`, `isbn`, `quantity`, `availableQuantity`, `createdAt`)
* `sortOrder`: `asc` or `desc`
* `available`: `true` returns only in-stock items (`availableQuantity > 0`)
* `lowStock`: `true` returns only low-stock items (`availableQuantity <= 2`)

- **Example Query**: `GET /books?page=1&limit=5&search=atomic&available=true`
- **Response Payload**:
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": {
    "books": [
      {
        "id": "7ac19532-6804-4b57-a9a7-47b2ea1a243e",
        "title": "Atomic Habits",
        "author": "James Clear",
        "isbn": "9780735211292",
        "quantity": 10,
        "availableQuantity": 10
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 5,
      "totalPages": 1
    }
  }
}
```

#### 7. Issue a Book (`POST /issuances`)
- **Request Payload**:
```json
{
  "memberId": "e2a392ab-9d8a-40a2-aa59-873cf106b3e6",
  "bookId": "7ac19532-6804-4b57-a9a7-47b2ea1a243e",
  "targetReturnDate": "2026-06-15T00:00:00.000Z"
}
```
- **Response Payload (Atomic Transaction Completed)**:
```json
{
  "success": true,
  "message": "Book issued successfully",
  "data": {
    "id": "90e29ad3-2c1b-4f91-884c-bdf0a256abcb",
    "memberId": "e2a392ab-9d8a-40a2-aa59-873cf106b3e6",
    "bookId": "7ac19532-6804-4b57-a9a7-47b2ea1a243e",
    "issueDate": "2026-05-28T00:00:00.000Z",
    "targetReturnDate": "2026-06-15T00:00:00.000Z",
    "actualReturnDate": null,
    "status": "ISSUED",
    "member": {
      "id": "e2a392ab-9d8a-40a2-aa59-873cf106b3e6",
      "name": "Rahul Sharma",
      "email": "rahul@example.com"
    },
    "book": {
      "id": "7ac19532-6804-4b57-a9a7-47b2ea1a243e",
      "title": "Atomic Habits",
      "author": "James Clear",
      "isbn": "9780735211292"
    }
  }
}
```

#### 8. Return a Borrowed Book (`PUT /issuances/:id/return`)
- **Response Payload (Atomic Transaction Restores Stock)**:
```json
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "id": "90e29ad3-2c1b-4f91-884c-bdf0a256abcb",
    "status": "RETURNED",
    "actualReturnDate": "2026-05-28T12:00:00.000Z"
  }
}
```

#### 9. List Active Overdue Books (`GET /issuances/overdue`)
- **Response Payload (Includes Dynamic overdueDays Computation)**:
```json
{
  "success": true,
  "message": "Overdue issuances retrieved successfully",
  "data": {
    "issuances": [
      {
        "id": "90e29ad3-2c1b-4f91-884c-bdf0a256abcb",
        "memberId": "e2a392ab-9d8a-40a2-aa59-873cf106b3e6",
        "bookId": "7ac19532-6804-4b57-a9a7-47b2ea1a243e",
        "issueDate": "2026-05-10T00:00:00.000Z",
        "targetReturnDate": "2026-05-20T00:00:00.000Z",
        "overdueDays": 8,
        "member": {
          "id": "e2a392ab-9d8a-40a2-aa59-873cf106b3e6",
          "name": "Rahul Sharma",
          "email": "rahul@example.com"
        },
        "book": {
          "id": "7ac19532-6804-4b57-a9a7-47b2ea1a243e",
          "title": "Atomic Habits",
          "author": "James Clear"
        }
      }
    ]
  }
```

#### 10. Fetch Library Stats Summary (`GET /analytics/stats`)
- **Response Payload**:
```json
{
  "success": true,
  "message": "Library statistics retrieved successfully",
  "data": {
    "totalBooks": 25,
    "totalMembers": 10,
    "activeIssuances": 3,
    "overdueBooks": 1
  }
}
```

#### 11. Fetch Overdue Summary Grouped by Member (`GET /analytics/overdue-summary`)
- **Response Payload**:
```json
{
  "success": true,
  "message": "Overdue statistics summary retrieved successfully",
  "data": {
    "overdueCounts": {
      "totalOverdueBooks": 1,
      "totalOverdueMembers": 1
    },
    "overdueMembers": [
      {
        "memberName": "Rahul Sharma",
        "email": "rahul@example.com",
        "overdueCount": 1
      }
    ],
    "overdueBooks": [
      {
        "memberName": "Rahul Sharma",
        "email": "rahul@example.com",
        "bookTitle": "Atomic Habits",
        "author": "James Clear",
        "issueDate": "2026-05-10T00:00:00.000Z",
        "targetReturnDate": "2026-05-20T00:00:00.000Z",
        "overdueDays": 8
      }
    ]
  }
}
```

#### 12. Fetch Books Never Borrowed (`GET /analytics/books/never-borrowed`)
- **Response Payload (Optimized LEFT JOIN Raw SQL Query)**:
```json
{
  "success": true,
  "message": "Never borrowed books retrieved successfully",
  "data": [
    {
      "bookTitle": "Clean Architecture",
      "author": "Robert C. Martin"
    },
    {
      "bookTitle": "Designing Data-Intensive Applications",
      "author": "Martin Kleppmann"
    }
  ]
}
```

#### 13. Fetch Outstanding Borrowings (`GET /analytics/books/outstanding`)
- **Response Payload (Optimized INNER JOIN Raw SQL Query)**:
```json
{
  "success": true,
  "message": "Outstanding books retrieved successfully",
  "data": [
    {
      "memberName": "Rahul Sharma",
      "bookTitle": "Atomic Habits",
      "issueDate": "2026-05-10T00:00:00.000Z",
      "targetReturnDate": "2026-05-20T00:00:00.000Z",
      "author": "James Clear"
    }
  ]
}
```

#### 14. Fetch Top 10 Borrowed Books (`GET /analytics/books/top-borrowed`)
- **Response Payload (Optimized GROUP BY Raw SQL Aggregation)**:
```json
{
  "success": true,
  "message": "Top borrowed books retrieved successfully",
  "data": [
    {
      "bookTitle": "Atomic Habits",
      "borrowCount": 5,
      "uniqueMembers": 3
    }
  ]
}
```

---

### 📊 Standardized API Response Layouts

All server operations return a standardized JSON format:

#### Success Format (2xx)
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

#### Error Format (4xx / 5xx)
```json
{
  "success": false,
  "message": "Error details and summaries.",
  "errors": [] // Array of validation error details (for 400 Bad Request)
}
```


---

## 💡 System Design Q&A (Interview Preparation)

### 🐋 Infrastructure & Docker Questions
- **Why Docker & Multi-Stage Staging?**
  Guarantees absolute workspace consistency. Developers run the application inside the exact same container setups that run inside staging and production pipelines, eliminating "works on my machine" bugs.
- **Why Separate Containers & Bridges?**
  Ensures microservice-readiness and service isolation. Databases, APIs, and client-facing web servers scale and crash independently on a dedicated bridge network (`lms-network`).
- **Why Bind Mounts & Anonymous Volumes?**
  Bind mounts (`./frontend:/app`) synchronize code updates in real-time to enable hot-reloading inside containers. Anonymous volumes (`/app/node_modules`) prevent the host machine from overriding node modules inside the container, preventing OS-level binary incompatibilities.

### 🗄️ Database & Prisma Questions
- **Why UUIDs instead of auto-incrementing Integers?**
  UUIDs are distributed-safe and impossible to guess sequentially. This blocks external malicious users from enumerating database records (e.g., calling `GET /api/members/1`, then `/2`, etc.), improving APIs security.
- **Why a separate Issuance Junction Table?**
  Maintains complete transaction history and historical tracking. Putting borrow details directly onto Member or Book arrays fails to track borrowing histories, late histories, and borrowing trends.
- **Why record availableQuantity on Book instead of running counts on-the-fly?**
  Performance optimizations. Running nested counts (e.g. counting total copies, then subtracting returned issuances) on every catalog cataloging fetch scales poorly ($O(N)$ database query). Keeping a reactive integer reduces searches to a basic constant-time ($O(1)$) fetch.
- **Why indexes on email, isbn, status, issueDate, and targetReturnDate?**
  Drastically reduces lookup overheads on core operational paths. Quick search triggers (searching books by `isbn`, searching members by `email`, locating overdue items on `targetReturnDate`, filtering logs on `status`) are optimized into index seeks, keeping search scale constant over millions of records.

### 🔒 Security & Middleware Questions
- **Why JSON Web Tokens (JWT) for authentication?**
  Enables stateless, highly scalable sessions. The server does not need to query session states or check database stores on every incoming request. Validating signatures cryptographically ($O(1)$ verification) is highly performant and scales seamlessly across clustered systems.
- **Why bcrypt for password hashing?**
  Designed to prevent brute-force attacks. Bcrypt utilizes a custom workload factor (salt rounds) that is computationally expensive, slowing down password cracking attempts. It also applies random salts natively to block pre-computed rainbow table queries.
- **Why Zod schemas instead of standard JavaScript objects?**
  Enforces type-safe request parsing at runtime. Zod acts as a secure boundary, scrubbing unexpected fields, formatting correct types, and rejecting malformed payloads before they reach business layers. This prevents injection attacks and keeps database records clean.
- **Why centralized error handler middleware?**
  Prevents stack trace leaks and maintains uniform interface contracts. Uncaught errors are safely logged internally while consumers receive clean, formatted, and secure JSON responses without exposing internal server architecture.
- **Why rate limiters on public login endpoints?**
  Prevents brute-force credential stuffing. Limiting requests per IP slows down automated spammers, protecting the authentication database from server exhaustion.

### 📊 SQL Analytics & Reporting Questions
- **Why LEFT JOIN for Never Borrowed Books query?**
  Using a `LEFT JOIN` on the Book table to the Issuance table captures all catalog books regardless of whether they have any borrowing records. Filtering with `WHERE i."bookId" IS NULL` isolates only the books that have never been issued.
- **Why GROUP BY and COUNT(DISTINCT) for Top Borrowed Books?**
  `GROUP BY b.id, b.title` collapses borrowing records to compute total transactions per book via `COUNT(i.id)`. Applying `COUNT(DISTINCT i."memberId")` is vital to count unique readers; without `DISTINCT`, if one member borrows the same book five times, they would count as five unique readers, corrupting the metrics.
- **Why raw SQL instead of ORM abstractions for analytics queries?**
  Analytics queries require specific joins, aggregations, and grouping structures. While ORMs can express these, raw SQL gives database developers exact control over execution plans, indexes, and eliminates unnecessary ORM overhead, ensuring extreme database performance on massive datasets.

### 💻 Frontend Architecture & Session Security Questions
- **Why Axios Request/Response Interceptors?**
  Attaching the token automatically in request interceptors ensures that all protected microservice requests are correctly signed without writing token injection logic in every separate axios call. Response interceptors act as a centralized boundary, immediately identifying token expirations (401s), flushing the storage, and routing back to `/login` seamlessly.
- **Why Protected Routes & Public Routes guards?**
  This prevents route manipulation in the browser (e.g. manually entering `/` in the address bar). Guards evaluate active session loaders, blocking unauthenticated users from entering operational panels, and redirecting logged-in administrators away from the login panel.
- **Why React Context for state management instead of Zustand?**
  React Context is built-in and perfect for managing session states (auth parameters, active token, administrator profile) across the entire component tree, requiring no third-party package overhead and keeping the bundle size highly optimized.
- **Why responsive glassmorphic layouts?**
  It provides a modern, state-of-the-art administrative experience that matches premium enterprise platforms. It uses flexbox, custom scroll overlays, and mobile menu grids to guarantee absolute layout consistency across Desktop, Tablet, and Mobile displays.

### 📖 OpenAPI & Swagger Documentation Questions
- **Why JSDoc comments and `swagger-jsdoc` instead of static JSON files?**
  Co-locating specs as structured JSDoc comments inside routes/docs or importing them in the build pipeline enables "Documentation as Code". It ensures that code modifications and specification updates evolve together, preventing documentation drift.
- **Why modularize Swagger paths, schemas, and examples?**
  Monolithic JSDoc blocks quickly clutter and bloat codebase files, making controllers hard to read. Splitting concerns into `src/docs/schemas/`, `/examples/`, and `/paths/` maintains clean software design and code readability.
- **Why configure `bearerAuth` security schema inside Swagger UI?**
  Provides a friction-free developer experience (DX). Rather than setting up third-party tools like Postman, developers can authenticate, store the token globally in the browser context, and test secure relational workflows instantly inside the browser.