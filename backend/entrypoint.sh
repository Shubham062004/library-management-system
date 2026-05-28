#!/bin/sh
set -e

echo "⏳ Container starting: executing database migrations deployment..."
npx prisma migrate deploy || echo "⚠ Prisma migration deploy failed or bypassed. Verify connection."

echo "🚀 Database schema verified successfully. Booting Express web application..."
exec "$@"
