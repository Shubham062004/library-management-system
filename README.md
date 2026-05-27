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
# Build and run containers in detached mode
docker compose up --build -d

# Verify container statuses
docker compose ps
```

Services are exposed at the following ports:
- **React Frontend Dashboard**: [http://localhost:3000](http://localhost:3000) (Nginx production build container) or [http://localhost:5173](http://localhost:5173) (Local development Vite container)
- **REST API Server**: [http://localhost:5000](http://localhost:5000)
- **PostgreSQL Database**: `localhost:5432`

---

## 🛠️ Running Services Locally for Active Development

### 1. Backend Server Setup
Navigate into the `backend/` directory, install packages, and boot the server in active hot-reloading mode:
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

## 🛡️ Code Quality & Coding Conventions

- **Linting**: Both services are backed by custom ESLint configurations to ensure strict typing, catch syntax errors early, and enforce robust formatting standards.
- **Formatting**: Integrated with Prettier to maintain uniform formatting across all TypeScript and CSS layouts.
```bash
# In backend/ or frontend/
npm run lint
```