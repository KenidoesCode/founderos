import { ethers } from "ethers";
import { prisma } from "../../config/db.js";
import { GenomeProfileSchema } from "../../utils/schemas.js";
import { logger } from "../../utils/logger.js";

// For MVP, we'll simulate IPFS storage
// In production, use nft.storage or similar
async function storePointer(profileJson: any): Promise<string> {
  // Simulate IPFS upload
  const hash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(profileJson)));
  const cid = Buffer.from(hash.slice(2, 34)).toString("hex");
  return `ipfs://simulated/${cid}`;
}

export async function generateGenome(tenantId: string, profileJson: any) {
  // Validate profile
  const validated = GenomeProfileSchema.safeParse(profileJson);
  if (!validated.success) {
    throw new Error("Invalid genome profile");
  }

  const canonicalJson = validated.data;

  // Compute hash
  const jsonString = JSON.stringify(canonicalJson);
  const hashBytes32 = ethers.keccak256(ethers.toUtf8Bytes(jsonString));

  // Store pointer (simulate IPFS)
  const pointerUrl = await storePointer(canonicalJson);

  // Store or update in DB
  const genome = await prisma.founderGenome.upsert({
    where: { tenantId },
    update: {
      pointer: pointerUrl,
      hash: hashBytes32,
      updatedAt: new Date(),
    },
    create: {
      tenantId,
      pointer: pointerUrl,
      hash: hashBytes32,
    },
  });

  return {
    hash: hashBytes32,
    pointer: pointerUrl,
    genome,
  };
}

export async function getGenome(tenantId: string) {
  return prisma.founderGenome.findUnique({
    where: { tenantId },
  });
}

export async function createUnsignedTx(hash: string, contractAddress: string) {
  // Create unsigned transaction for register() call
  const iface = new ethers.Interface([
    "function register(bytes32 genomeHash) external",
  ]);

  const data = iface.encodeFunctionData("register", [hash]);

  return {
    to: contractAddress,
    data,
    value: "0x0",
  };
}

