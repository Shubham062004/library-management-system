# LuminaLib — Production-Grade Library Management System

[![Continuous Integration](https://github.com/Shubham062004/library-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/Shubham062004/library-management-system/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.3+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-blue.svg)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-purple.svg)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

LuminaLib is an enterprise-grade, full-stack, and dockerized Library Management System designed for high performance, transactional consistency, and modular scalability. It integrates a sleek, glassmorphic React dashboard with a secure Express REST API, type-safe Prisma ORM, and PostgreSQL, all fully automated with Docker and GitHub Actions CI.

---

## 🎯 Core Features

- 🔑 **Stateless Auth Gate**: Secure JWT-based authentication with bcrypt hashing, rate limiting, and reactive route guards.
- 👥 **Member Management**: Fully paginated CRUD APIs with searching, sorting, Zod validators, and unique email validation.
- 📚 **Book Inventory Track**: Catalog management with automatic real-time `availableQuantity` tracking and ISBN constraint guards.
- 📡 **Issuance & Returns Transactions**: Atomic PostgreSQL transaction blocks (`prisma.$transaction`) ensuring inventory consistency, active borrow limits, and double-return preventions.
- 📊 **SQL Analytics & Reports**: Specialized Raw SQL join and aggregation queries separating operational data and reporting concerns.
- 📖 **Interactive Specs UI**: Self-documenting OpenAPI 3.0 specs with Swagger UI and pre-configured Postman collections.
- 🐋 **DevOps Containerization**: Multi-stage lightweight Alpine Dockerfiles automated using Docker Compose and GitHub Actions.

---

## 🚀 Tech Stack

- **Frontend**: React v19 + Vite + TypeScript + Tailwind CSS (Axios, React Router v7, Lucide Icons)
- **Backend**: Node.js + Express + TypeScript (Helmet headers, CORS, Morgan logger, rate-limit)
- **Database**: PostgreSQL + Prisma ORM (migrations, raw query executions, seeding scripts)
- **DevOps**: Docker + Docker Compose + GitHub Actions CI (multi-stage optimized compilation)
- **API Docs**: Swagger UI + OpenAPI 3.0 (`swagger-ui-express`, `swagger-jsdoc`)

---

## 🏛️ System Architecture

```text
       ┌────────────────────────┐
       │     React Frontend     │ <-- Served via Nginx static asset bundling
       └───────────┬────────────┘
                   │ HTTPS (CORS filtered)
                   ▼
       ┌────────────────────────┐
       │  Express REST API Gate │ <-- Helmet, Morgan logger, Express Rate-Limit
       └───────────┬────────────┘
                   │ JWT Authorization & Zod Schema Validation
                   ▼
       ┌────────────────────────┐
       │   Prisma ORM Client    │ <-- Transactional isolation & raw PG queries
       └───────────┬────────────┘
                   │ Port 5432 connection
                   ▼
       ┌────────────────────────┐
       │  PostgreSQL Database   │ <-- Normalized relation maps & foreign indexes
       └────────────────────────┘
```

---

## 📂 Project Folder Structure

```text
library-management-system/
│
├── .github/workflows/    # CI/CD automation pipelines (GitHub Actions)
│   └── ci.yml            # Code linting, type-checking, and build checks
│
├── frontend/             # Single-Page React Web Application (Vite + TS)
│   ├── src/
│   │   ├── api/          # Axios instance and response interceptors
│   │   ├── components/   # Modular UI elements (.gitkeep empty folders setup)
│   │   ├── context/      # AuthContext session state manager
│   │   ├── layouts/      # Root layout frame (Sidebar, navbar, profile)
│   │   ├── pages/        # Dashboard, Login, and NotFound screens
│   │   ├── routes/       # React RouterProtected and Public guards
│   │   └── types/        # TypeScript interfaces and models
│   ├── Dockerfile        # Production multi-stage client build serving via Nginx
│   └── vite.config.ts    # Polling HMR server config
│
├── backend/              # Node.js + Express REST API Server (TS)
│   ├── src/
│   │   ├── config/       # Environment loading modules
│   │   ├── docs/         # Modular Swagger UI documentation spec
│   │   │   ├── schemas/  # Reusable OpenAPI schemas
│   │   │   ├── examples/ # Swagger request/response payload examples
│   │   │   ├── paths/    # Spec paths grouped by domain tag
│   │   │   └── swagger.ts# Root swagger-jsdoc config
│   │   ├── middleware/   # JWT auth, rate limits, error interceptors
│   │   ├── modules/      # Feature-isolated modules (book, member, etc.)
│   │   ├── postman/      # Automated Postman Collection and Environment files
│   │   ├── docs/qa/      # Comprehensive QA Testing manuals
│   │   └── app.ts        # Express bootstrapping & REST routers mount
│   ├── prisma/           # Database migration files and seed scripts
│   └── Dockerfile        # Production lightweight Alpine server build
│
├── docker-compose.yml    # Monorepo service container orchestrator
└── README.md             # Project developer manual
```

---

## ⚙️ Quickstart Onboarding Setup

To get LuminaLib running locally, verify you have [Node.js v20+](https://nodejs.org/) and [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

### 1. Environment Cloning
```bash
git clone https://github.com/Shubham062004/library-management-system.git
cd library-management-system
git checkout develop
```

### 2. Environment Variables Setup
Copy the environment variable templates:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Modular Guides & Onboarding Manuals
For deep-dive steps, navigate to the technical guides inside the repository:
* 📖 [Developer Onboarding Checklist](backend/docs/submission/onboarding_guide.md): Environment configs, local databases, database seeds, and port checkouts.
* 🏛️ [System Architecture Manual](backend/docs/submission/architecture_guide.md): Layered systems diagrams, database entity maps, transactional logic, and search index optimizations.
* ☁️ [Production Deployment Blueprints](backend/docs/submission/deployment_guide.md): Blueprints for Docker Compose, VPS servers (Nginx reverse proxies, PM2, and Let's Encrypt SSL), and serverless hosting (Railway + Supabase).
* 💡 [Technical Interview Walkthrough Guide](backend/docs/submission/interview_guide.md): Problem statements walkthrough, index designs, relational aggregates raw SQL, and transaction isolations.

---

## 🐋 Running via Docker (Recommended)

Spins up PostgreSQL, compiles backend TypeScript, bundles the React application inside Nginx, and exposes the services cleanly on a private bridge network.

```bash
# Build and run the entire development stack in the foreground (recommended for logs)
docker compose up --build

# Sync migrations and seed the database inside the running container
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run seed
```

Services are exposed at:
- **React Frontend**: [http://localhost:5173](http://localhost:5173) (With polling HMR active)
- **REST API Server**: [http://localhost:5000](http://localhost:5000)
- **PostgreSQL Database**: `localhost:5432`

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

---

## 🧪 QA Testing & Validation Workflows

LuminaLib implements a comprehensive backend Quality Assurance (QA) and API validation suite to guarantee absolute transactional consistency and production readiness.

### 📊 QA Artifacts & Manuals
Detailed testing guidelines, constraints whitelists, and production release parameters are documented modularly in the codebase:
- [QA Testing Guide](backend/docs/qa/testing_guide.md): Details our multi-layer testing hierarchy, the public health checks `/health`, status assertions whitelists, and Postman execution plans.
- [Zod API Validation Checklist](backend/docs/qa/validation_checklist.md): Standardizes the active validation schemas, required request payload parameters, phone and ISBN checks.
- [Edge Cases Testing Manual](backend/docs/qa/edge_cases.md): Maps business boundary validations (duplicate ISBNs/emails, book stock exhaustions, max borrowing caps, double return preventions).
- [Production Readiness Checklist](backend/docs/qa/production_readiness.md): Establishes deployment checkout parameters (Express request body limits, Helmet security headers, CORS origin restrictions, database index maps).

### 🚀 Bootstrapping Automated Postman Tests
We expose preconfigured JSON assets to verify all endpoints (Auth, Members, Books, Issuances, Analytics, Health) automatically:
1. **Import Assets**: Open Postman, click **Import**, and select the two files in the repository:
   * **Collection**: [LuminaLib.postman_collection.json](backend/postman/LuminaLib.postman_collection.json)
   * **Environment**: [LuminaLib.postman_environment.json](backend/postman/LuminaLib.postman_environment.json)
2. **Execute Onboarding Auth**:
   * Run `POST /auth/login` inside the **Auth** folder using the preconfigured credentials.
   * Postman executes a native test script that extracts the returned secure JWT token and saves it globally to the `TOKEN` environment variable.
3. **Inherited Token Testing**:
   * All protected endpoints inside the collection automatically inherit this authenticated token structure (`Bearer {{TOKEN}}`), letting you execute sequential query scripts with a single click!

---

## 📡 REST API Route Table

All private endpoints require Bearer JWT validation passed in request headers: `Authorization: Bearer <token>`

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

## 🔮 Future Improvements

- 🚀 **Dynamic WebSockets Alerts**: Hook up active real-time notifications when checkouts reach 3 days before overdue thresholds.
- 📦 **Redis Cache Integration**: Place Redis caching layers on high-frequency analytical queries (e.g. `GET /analytics/books/top-borrowed`) to completely eliminate direct PG queries overhead.
- 🏢 **Multi-Tenant Library Support**: Scale database relations to support isolated tenants boundaries, allowing independent schools or municipalities to share the portal safely.

---

## 📝 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---

## 👤 Author

* **Shubham Kumar** - *Core Architect & Full-Stack Engineer* - [GitHub Profile](https://github.com/Shubham062004)