# Common Issues & Solutions

## Database Migration Fails
**Error**: "P1001: Can't reach database server"
**Solution**: Check DATABASE_URL in .env, ensure PostgreSQL is running

## bKash Sandbox Returns 401
**Error**: "Unauthorized: Invalid app_key"
**Solution**: Verify credentials at developer.bka.sh, regenerate tokens if expired

## TypeScript Error: "Cannot find module '@/components/ui/button'"
**Solution**: Run `npm install` to ensure all dependencies installed

## Prisma: Cannot find schema.prisma
**Solution**: Ensure `prisma/schema.prisma` exists and `PRISMA_SCHEMA` points to correct path; run `npx prisma generate` after changes

## Rate Limiter: 429 Too Many Requests in dev
**Solution**: Check Upstash credentials in env (UPSTASH_REDIS_URL/UPSTASH_REDIS_TOKEN) or disable rate limiter locally by toggling feature flag
