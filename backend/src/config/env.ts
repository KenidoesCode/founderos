import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "6060", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Database
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/founderos_dev",
  
  // Redis
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  embeddingsModel: process.env.EMBEDDINGS_MODEL || "text-embedding-3-small",
  
  // Vector DB
  vectorDbProvider: process.env.VECTOR_DB_PROVIDER || "pinecone", // pinecone | pgvector
  pineconeApiKey: process.env.PINECONE_API_KEY || "",
  pineconeEnvironment: process.env.PINECONE_ENVIRONMENT || "",
  pineconeIndex: process.env.PINECONE_INDEX || "founderos",
  
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  
  // Email
  sendgridApiKey: process.env.SENDGRID_API_KEY || "",
  
  // Blockchain
  chainRpcUrl: process.env.CHAIN_RPC_URL || "",
  contractAddress: process.env.CONTRACT_ADDRESS || "",
  relayerPk: process.env.RELAYER_PK || "",
  
  // Frontend
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  
  // Feature flags
  useMocks: process.env.USE_MOCKS === "true",
};

