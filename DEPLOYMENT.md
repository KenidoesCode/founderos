# FounderOS Deployment Guide

## Quick Start (Local Development)

### 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL and Redis.

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npx prisma migrate dev
npm run seed
npm run dev
```

Backend runs on `http://localhost:6060`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:6060
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Contracts (Optional)

```bash
cd contracts
npm install
cp .env.example .env
# Add your RPC URL and private key
npx hardhat compile
npx hardhat run scripts/deploy.ts --network baseSepolia
```

## Environment Variables

### Backend (.env)

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret for JWT signing
- `OPENAI_API_KEY` - OpenAI API key for LLM

Optional:
- `REDIS_URL` - Redis connection (defaults to localhost)
- `PINECONE_API_KEY` - For vector DB (or use pgvector)
- `STRIPE_SECRET_KEY` - For payments
- `SENDGRID_API_KEY` - For email
- `CHAIN_RPC_URL` - Blockchain RPC endpoint
- `CONTRACT_ADDRESS` - Deployed contract address

### Frontend (.env.local)

Required:
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Production Deployment

### Backend (Render/Fly/Cloud Run)

1. Set environment variables in your platform's secret manager
2. Deploy from Git or Docker image
3. Run migrations: `npx prisma migrate deploy`
4. Seed initial data (optional): `npm run seed`

### Frontend (Vercel)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push to main

### Database

Recommended: Neon, Supabase, or Railway for managed PostgreSQL with pgvector support.

### Vector DB

- Option A: Pinecone (managed, recommended for scale)
- Option B: pgvector extension in PostgreSQL (simpler, good for MVP)

## Testing

### Health Check

```bash
curl http://localhost:6060/health
```

### Test Authentication

```bash
# Register
curl -X POST http://localhost:6060/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:6060/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Demo Account

After seeding:
- Email: `demo@founderos.app`
- Password: `demo123`

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running:
```bash
docker-compose ps
```

### Prisma Migration Issues

Reset database (development only):
```bash
npx prisma migrate reset
```

### OpenAI API Errors

Check your API key and ensure you have credits. Use `USE_MOCKS=true` for development without API access.

## Security Checklist

- [ ] Change all default secrets
- [ ] Use HTTPS in production
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Store secrets in secret manager (never commit)
- [ ] Enable database backups
- [ ] Set up monitoring and alerts

