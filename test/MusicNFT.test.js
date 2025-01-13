const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MusicNFT Contract", function () {
  let MusicNFT;
  let musicNFT;
  let owner;
  let addr1;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    MusicNFT = await ethers.getContractFactory("MusicNFT");
    [owner, addr1] = await ethers.getSigners(); // Fixed: getSigners() not getSigner()
    musicNFT = await MusicNFT.deploy(); // Fixed: Added await
    await musicNFT.waitForDeployment(); // Fixed: Wait for deployment
  });

  it("Should mint a new NFT", async function () {
    await musicNFT.connect(addr1).mintNFT(
      "Track 1",
      "Weeknd",
      "ipfs://track1",
      ethers.parseEther("0.01") // Fixed: ethers.parseEther instead of ethers.utils.parseEther
    );

    const musicInfo = await musicNFT.getMusicNFT(0);

    expect(musicInfo.trackName).to.equal("Track 1");
    expect(musicInfo.artistName).to.equal("Weeknd");
  });

  it("Should emit an event when NFT is minted", async function () {
    // Fixed: Restructured the expect statement
    await expect(
      musicNFT
        .connect(addr1)
        .mintNFT(
          "Track 2",
          "Artist 2",
          "ipfs://track2",
          ethers.parseEther("0.02")
        )
    )
      .to.emit(musicNFT, "MusicMinted")
      .withArgs(
        0,
        "Track 2",
        "Artist 2",
        "ipfs://track2",
        ethers.parseEther("0.02")
      );
  });
});
