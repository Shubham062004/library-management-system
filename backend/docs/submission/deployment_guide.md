# LuminaLib Production Deployment Guide

This guide provides the complete deployment blueprints, configurations, and production environment guidelines required to deploy the LuminaLib Library Management System to live servers.

---

## 🐋 1. Local Containerized Deployment (Docker Compose)

The easiest way to bootstrap the entire production stack locally:

```bash
# 1. Build and boot all services (PostgreSQL, Backend API, Nginx Frontend)
docker compose up --build -d

# 2. Sync database schema migrations
docker compose exec backend npx prisma migrate deploy

# 3. Seed database (Optional)
docker compose exec backend npm run seed
```

### Container Layout
* **`postgres`**: Exposes database port `5432` internally inside the bridge network `lms-network`.
* **`backend`**: Runs the backend node process, exposing port `5000` to the host.
* **`frontend`**: Compiles the React production bundle, serves static assets via Nginx, and exposes port `5173`.

---

## ☁️ 2. Cloud Serverless Deployments (Render & Railway)

LuminaLib is microservices-ready and can be split into three scalable cloud components:

```text
    Vercel/Netlify (Static Frontend) ──> Render/Railway (Vite Server API) ──> Neon/Supabase (PostgreSQL)
```

### Part A: PostgreSQL Database (Neon / Supabase)
1. Register a free PostgreSQL instance on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Copy the connection string. Ensure it uses transaction pooling (usually port `6543` for Supabase) and append `?schema=public` to the target database URL.

### Part B: Express REST API (Render / Railway)
1. Deploy a new Web Service pointing to your cloned GitHub repository.
2. Select root directory as `backend/`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Configure Environment Variables:
   * `DATABASE_URL`: Your Supabase/Neon connection string.
   * `JWT_SECRET`: A long secure random string.
   * `CORS_ORIGIN`: Your deployed frontend URL.
   * `PORT`: `5000`

### Part C: Static React Frontend (Vercel / Netlify)
1. Deploy a new Static Site pointing to your cloned repository.
2. Select root directory as `frontend/`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables:
   * `VITE_API_URL`: Your deployed Render/Railway backend URL.

---

## 🖥️ 3. Linux VPS Deployment (Ubuntu + Nginx + PM2)

For absolute control and maximum performance, host LuminaLib on a VPS (DigitalOcean, AWS EC2, or Linode):

```text
    Web Visitor ──> HTTPS (443) ──> Nginx Reverse Proxy ──> Port 5000 (PM2 Node API Server)
```

### Part A: Server Onboarding & Database Setup
```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js v20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL database server
sudo apt install -y postgresql postgresql-contrib
```

### Part B: PM2 Process Management
PM2 keeps the Node API process running in the background and restarts it on server reboots.
```bash
# 1. Install PM2 globally
sudo npm install -g pm2

# 2. Clone project and navigate to backend
git clone https://github.com/Shubham062004/library-management-system.git
cd library-management-system/backend

# 3. Install dependencies and build
npm install
npx prisma generate
npm run build

# 4. Boot server process under PM2
pm2 start dist/app.js --name luminalib-backend

# 5. Set up PM2 system restart hook
pm2 startup systemd
pm2 save
```

### Part C: Nginx Reverse Proxy Setup
```bash
# 1. Install Nginx web server
sudo apt install -y nginx

# 2. Create site config file
sudo nano /etc/nginx/sites-available/luminalib
```
Insert the reverse proxy and static server configurations block:
```nginx
server {
    listen 80;
    server_name api.luminalib.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Activate config and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/luminalib /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Part D: SSL Certificate (Let's Encrypt Certbot)
```bash
# 1. Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# 2. Fetch and apply SSL certificate automatically
sudo certbot --nginx -d api.luminalib.com
```

---

## ⚡ 4. Production Optimizations Checklist

* **Connection Pool Ceiling**: Adjust connection pool configurations inside the Supabase/Neon PostgreSQL dashboard to support traffic bursts.
* **Gzip Compression**: Enable Gzip compression in Nginx to reduce static resource transfer payloads.
* **Rate Limits Scale**: Expand rate limits ceilings on `/auth/login` to accommodate office/institutional IPs (where multiple users share an IP).
* **PM2 Cluster Mode**: Run backend under PM2 cluster mode to utilize multi-core CPU architectures:
  ```bash
  pm2 start dist/app.js -i max --name luminalib-backend
  ```
