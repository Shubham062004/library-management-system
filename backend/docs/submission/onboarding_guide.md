# LuminaLib Developer Onboarding Guide

This onboarding checklist guides new developers through cloning, environment configuration, database syncing, and bootstrapping the LuminaLib workspace in minutes.

---

## 🛠️ Step-by-Step Workspace Bootstrapping

### 1. Environment Cloning & Prerequisites
Ensure you have the following prerequisites installed on your host machine:
* **Node.js**: v20.x or higher LTS
* **Docker Desktop**: v4.x or higher
* **Git**: v2.x or higher

Clone the monorepo repository and switch to the develop branch:
```bash
git clone https://github.com/Shubham062004/library-management-system.git
cd library-management-system
git checkout develop
```

### 2. Hydrating Environment Templates
LuminaLib handles configurations dynamically via localized environment files. Create local copies from the templates:
```bash
# 1. Hydrate root configuration
cp .env.example .env

# 2. Hydrate backend variables
cp backend/.env.example backend/.env

# 3. Hydrate frontend Vite environment
cp frontend/.env.example frontend/.env
```

### 3. Database Migration & Client Generation
Boot up the local database service and sync migrations to establish PostgreSQL schema boundaries:
```bash
# 1. Boot up the PostgreSQL database container separately
docker compose up postgres -d

# 2. Navigate to backend and install packages
cd backend
npm install

# 3. Apply Prisma migrations to the database
npx prisma migrate dev --name init

# 4. Generate the type-safe Prisma Client bindings
npx prisma generate
```

### 4. Injecting Seed Records
Seed the relational database with structured sample records (10 members, 20 books, and 7 transactional checkouts):
```bash
npm run seed
```

### 5. Running the Monorepo Workspace Locally

#### Tab A: Express Backend Server
Boot the backend server in watch mode:
```bash
cd backend
npm run dev
```
* Exposes REST endpoints at: [http://localhost:5000](http://localhost:5000)
* Open [http://localhost:5000/health](http://localhost:5000/health) to verify operational health status.

#### Tab B: React Frontend Client
Open a second terminal window, install packages, and boot Vite's dev server:
```bash
cd frontend
npm install
npm run dev
```
* Exposes the admin dashboard at: [http://localhost:5173](http://localhost:5173)

---

## 🔍 Onboarding Verification Checkpoints

Before creating your first feature branch, run this quick checklist to confirm your workspace is fully operational:

- [ ] **Health endpoint validation**: Visiting `GET http://localhost:5000/health` returns `200 OK` and `"Server running successfully"`.
- [ ] **Interactive API Specs**: Opening `http://localhost:5000/api-docs` renders the Swagger UI portal successfully.
- [ ] **Prisma Studio**: Running `npx prisma studio` in the `backend/` directory lets you browse seed database records visually in the browser.
- [ ] **HMR Polling verification**: Modifying a React component in the editor instantly hot-reloads the frontend browser view on `http://localhost:5173`.
- [ ] **TypeScript build typecheck**: Running `npm run build` in both `frontend/` and `backend/` directories compiles successfully without any TypeScript compiler errors.
