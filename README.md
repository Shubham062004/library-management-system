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