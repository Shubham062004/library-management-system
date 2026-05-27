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

## 💡 System Design Q&A (Interview Preparation)

- **Why Docker & Multi-Stage Staging?**
  Guarantees absolute workspace consistency. Developers run the application inside the exact same container setups that run inside staging and production pipelines, eliminating "works on my machine" bugs.
- **Why Separate Containers & Bridges?**
  Ensures microservice-readiness and service isolation. Databases, APIs, and client-facing web servers scale and crash independently on a dedicated bridge network (`lms-network`).
- **Why Bind Mounts & Anonymous Volumes?**
  Bind mounts (`./frontend:/app`) synchronize code updates in real-time to enable hot-reloading inside containers. Anonymous volumes (`/app/node_modules`) prevent the host machine from overriding node modules inside the container, preventing OS-level binary incompatibilities.