const { ethers } = require("hardhat");

async function main() {
  const MusicNFT = await ethers.getContractFactory("MusicNFT");
  const musicNFT = await MusicNFT.deploy();

  // Wait for the contract to be deployed
  await musicNFT.waitForDeployment();

  // Get the contract address
  const address = await musicNFT.getAddress();
  console.log("MusicNFT deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
