# FounderOS Architecture

## System Overview

FounderOS is a full-stack SaaS application with the following components:

- **Frontend**: Next.js 14 (App Router) with React, TypeScript, Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Vector DB**: pgvector (PostgreSQL extension) or Pinecone
- **AI**: OpenAI GPT-4o-mini + embeddings
- **Blockchain**: Solidity smart contracts on Base Sepolia
- **Infrastructure**: Docker, Redis (optional)

## Core Modules

### 1. AI Cofounder

**Purpose**: RAG-powered AI assistant with memory and persona modes

**Flow**:
1. User asks question
2. System embeds question
3. Vector search retrieves relevant memories
4. LLM generates structured JSON response
5. Response saved as memory (if important)

**Key Files**:
- `backend/src/modules/cofounder/service.ts` - Core RAG logic
- `backend/src/modules/cofounder/personas.ts` - Persona prompts
- `frontend/app/cofounder/page.tsx` - Chat interface

### 2. Auto-Startup Generator

**Purpose**: Generate validated startup ideas with landing pages

**Flow**:
1. User provides inputs (tags, market, skills, budget)
2. LLM generates structured startup JSON
3. System creates StartupIdea record
4. User can generate landing page from idea

**Key Files**:
- `backend/src/modules/startup/service.ts` - Generation logic
- `frontend/components/startup/GeneratorForm.tsx` - Input form
- `frontend/components/startup/IdeaOutput.tsx` - Results display

### 3. Founder Genome

**Purpose**: On-chain founder identity (SBT-like)

**Flow**:
1. User profile data collected
2. Profile JSON canonicalized and hashed (keccak256)
3. Hash stored on-chain via smart contract
4. Full profile stored off-chain (IPFS/S3)

**Key Files**:
- `contracts/contracts/FounderGenome.sol` - Smart contract
- `backend/src/modules/genome/service.ts` - Hashing and storage
- `frontend/app/genome/page.tsx` - UI

### 4. Time-Warp Engine

**Purpose**: Predictive execution forecasting

**Flow**:
1. Collect metrics (streak, tasks, maturity)
2. Compute weighted score
3. Map to confidence and date window
4. Generate explanation via LLM

**Key Files**:
- `backend/src/modules/timewarp/service.ts` - Prediction logic
- `frontend/components/timewarp/Timeline.tsx` - Visualization

## Data Model

### Core Entities

- **User**: Authentication and user profile
- **Tenant**: Workspace (multi-tenant support)
- **StartupIdea**: Generated startup ideas
- **Memory**: RAG memories with embeddings
- **Task**: Execution tasks
- **FounderGenome**: On-chain identity
- **Streak**: Daily activity tracking

### Relationships

```
User 1:N Tenant
Tenant 1:N StartupIdea
Tenant 1:N Memory
Tenant 1:N Task
Tenant 1:1 FounderGenome
Tenant 1:1 Streak
```

## API Structure

All routes follow pattern: `/api/{module}/{action}`

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Cofounder
- `POST /api/cofounder/ask`
- `GET /api/cofounder/memories`
- `POST /api/cofounder/memory`

### Startup
- `POST /api/startup/generate`
- `GET /api/startup/list`
- `GET /api/startup/:slug`
- `POST /api/startup/publish`

### Genome
- `POST /api/genome/generate`
- `GET /api/genome`
- `POST /api/genome/mint`

### Time-Warp
- `GET /api/timewarp/next`

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Frontend Structure

### Pages (App Router)

- `/` - Root (redirects)
- `/login` - Authentication
- `/register` - Registration
- `/dashboard` - Main dashboard
- `/cofounder` - AI chat
- `/startup-generator` - Idea generation
- `/genome` - Founder identity
- `/timewarp` - Predictions
- `/settings` - Settings
- `/profile` - User profile
- `/swarm` - Cofounder matching (future)

### Components

- `components/layout/` - Sidebar, Topbar
- `components/dashboard/` - Dashboard cards
- `components/cofounder/` - Chat UI
- `components/startup/` - Generator forms
- `components/genome/` - Genome visualization
- `components/timewarp/` - Timeline

### State Management

Zustand store (`lib/state.ts`) manages:
- User and tenant
- Active startup
- Persona mode
- Streak
- Auth token

## Security

### Authentication
- JWT tokens with 7-day expiry
- Password hashing with bcrypt
- Token stored in Zustand (in-memory)

### Authorization
- All routes require authentication
- Tenant-scoped queries (middleware)
- No cross-tenant data access

### Data Protection
- Input validation (Zod schemas)
- SQL injection prevention (Prisma)
- XSS protection (React escaping)

## Scalability

### Multi-Tenancy
- Soft multi-tenant (single DB, tenantId column)
- Can migrate to hard multi-tenant later

### Vector DB
- pgvector for MVP (simple)
- Pinecone for scale (managed)

### Caching
- Redis for rate limiting (future)
- Memory caching for LLM responses

### Rate Limiting
- Per-tenant quotas (future)
- Redis token bucket (future)

## Monitoring

### Logging
- Structured JSON logs
- Winston/Pino (future)
- Sentry for errors (future)

### Metrics
- Prometheus endpoint (future)
- LLM usage tracking
- Request latency

## Deployment

See `DEPLOYMENT.md` for detailed instructions.

### Recommended Stack
- Frontend: Vercel
- Backend: Render/Fly/Cloud Run
- Database: Neon/Supabase
- Vector DB: Pinecone or pgvector
- Redis: Upstash

