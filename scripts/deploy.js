const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CommunityToken
  const communityToken = await hre.ethers.deployContract("CommunityToken", [deployer.address]);
  await communityToken.waitForDeployment();
  const communityTokenAddress = await communityToken.getAddress();
  console.log("CommunityToken deployed to:", communityTokenAddress);

  // Deploy Faucet
  const faucet = await hre.ethers.deployContract("Faucet", [communityTokenAddress, deployer.address]);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  // Fund the Faucet
  const amount = hre.ethers.parseEther("500000"); // 500,000 tokens
  await communityToken.transfer(faucetAddress, amount);
  console.log(`Transferred ${hre.ethers.formatEther(amount)} COMM to Faucet contract`);

  // Create directory if it doesn't exist
  const dir = "./src/lib/artifacts";
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  // Save contract info
  const contractInfo = {
    CommunityToken: {
      address: communityTokenAddress,
      abi: JSON.parse(communityToken.interface.formatJson()),
    },
    Faucet: {
      address: faucetAddress,
      abi: JSON.parse(faucet.interface.formatJson()),
    },
  };

  fs.writeFileSync(
    "./src/lib/contractInfo.json",
    JSON.stringify(contractInfo, null, 2)
  );
  console.log("Contract info saved to src/lib/contractInfo.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
