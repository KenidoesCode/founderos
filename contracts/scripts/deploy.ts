import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FounderGenome contract...");

  const FounderGenome = await ethers.getContractFactory("FounderGenome");
  const contract = await FounderGenome.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("FounderGenome deployed to:", address);
  console.log("Network:", network.name);
  console.log("\nSave this address in your .env as CONTRACT_ADDRESS");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

