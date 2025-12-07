# FounderOS

AI cofounder optimized for launching and scaling startups.

## Architecture

- **Frontend**: Next.js 14 (App Router) + Tailwind + ShadCN UI
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **AI**: OpenAI GPT-4o-mini + embeddings + vector DB
- **Blockchain**: Solidity smart contracts on Base Sepolia
- **Infrastructure**: Docker, Redis, IPFS

## Quick Start

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)
- Redis (or use Docker)

### Setup

1. **Start infrastructure:**
   ```bash
   docker-compose up -d
   ```

2. **Backend setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your keys
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

4. **Contracts setup:**
   ```bash
   cd contracts
   npm install
   cp .env.example .env
   # Add your RPC URL and private key
   npx hardhat compile
   ```

## Environment Variables

See `.env.example` files in each directory for required variables.

**Never commit actual keys to the repository.**

## Features

1. **AI Cofounder** - RAG-powered memory system with persona modes
2. **Auto-Startup Generator** - Validated startup ideas with landing pages
3. **Founder Genome** - On-chain founder identity (SBT-like)
4. **Time-Warp Engine** - Predictive execution forecasting

## License

MIT

