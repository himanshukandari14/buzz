const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MusicNFT Contract", function () {
  let MusicNFT, musicNFT, owner, artist, buyer;

  beforeEach(async function () {
    // Deploy contract before each test
    MusicNFT = await ethers.getContractFactory("MusicNFT");
    [owner, artist, buyer] = await ethers.getSigners();
    musicNFT = await MusicNFT.deploy();
    await musicNFT.waitForDeployment(); // Correctly using `waitForDeployment()`
  });

  it("should mint a new NFT", async function () {
    const trackName = "Song One";
    const artistName = "Artist A";
    const uri = "https://example.com/song1";
    const price = ethers.parseEther("1"); // 1 ether (updated to ethers v6 syntax)
    const royaltyPercentage = 10;

    await expect(
      musicNFT
        .connect(artist)
        .mintNFT(trackName, artistName, uri, price, royaltyPercentage)
    )
      .to.emit(musicNFT, "MusicMinted")
      .withArgs(0, trackName, artistName, uri, price);

    const musicNFTDetails = await musicNFT.getMusicNFT(0);
    expect(musicNFTDetails.trackName).to.equal(trackName);
    expect(musicNFTDetails.artistName).to.equal(artistName);
    expect(musicNFTDetails.uri).to.equal(uri);
    expect(musicNFTDetails.price).to.equal(price);
    expect(musicNFTDetails.creator).to.equal(artist.address);
    expect(musicNFTDetails.royaltyPercentage).to.equal(royaltyPercentage);
  });

  it("should allow the owner to set a new price", async function () {
    const trackName = "Song One";
    const artistName = "Artist A";
    const uri = "https://example.com/song1";
    const price = ethers.parseEther("1"); // Updated to ethers v6 syntax
    const royaltyPercentage = 10;

    await musicNFT
      .connect(artist)
      .mintNFT(trackName, artistName, uri, price, royaltyPercentage);

    const newPrice = ethers.parseEther("2"); // Updated to ethers v6 syntax
    await musicNFT.connect(artist).setPrice(0, newPrice);

    const musicNFTDetails = await musicNFT.getMusicNFT(0);
    expect(musicNFTDetails.price).to.equal(newPrice);
  });

  it("should allow buyer to purchase NFT and pay royalties", async function () {
    const trackName = "Song One";
    const artistName = "Artist A";
    const uri = "https://example.com/song1";
    const price = ethers.parseEther("1");
    const royaltyPercentage = 10;

    // Mint the NFT
    await musicNFT
      .connect(artist)
      .mintNFT(trackName, artistName, uri, price, royaltyPercentage);

    // Set up balance checks before purchase
    const initialArtistBalance = await ethers.provider.getBalance(
      artist.address
    );

    // Buyer purchases the NFT
    await expect(musicNFT.connect(buyer).buyNFT(0, { value: price }))
      .to.emit(musicNFT, "Transfer")
      .withArgs(artist.address, buyer.address, 0);

    // Check balances after purchase
    const finalArtistBalance = await ethers.provider.getBalance(artist.address);

    // Artist should receive:
    // 1. The main payment (90% as they are the current owner)
    // 2. The royalty payment (10% as they are the creator)
    // So effectively they should receive 100% of the payment
    expect(finalArtistBalance).to.equal(initialArtistBalance + price);
  });

  it("should fail if royalty percentage is more than 25%", async function () {
    const trackName = "Song One";
    const artistName = "Artist A";
    const uri = "https://example.com/song1";
    const price = ethers.parseEther("1"); // Updated to ethers v6 syntax
    const royaltyPercentage = 30;

    await expect(
      musicNFT
        .connect(artist)
        .mintNFT(trackName, artistName, uri, price, royaltyPercentage)
    ).to.be.revertedWith("Royalty percentage cannot exceed 25%");
  });

  it("should fail if buyer does not send enough funds", async function () {
    const trackName = "Song One";
    const artistName = "Artist A";
    const uri = "https://example.com/song1";
    const price = ethers.parseEther("1"); // Updated to ethers v6 syntax
    const royaltyPercentage = 10;

    // Mint the NFT
    await musicNFT
      .connect(artist)
      .mintNFT(trackName, artistName, uri, price, royaltyPercentage);

    // Buyer tries to buy NFT with insufficient funds
    await expect(
      musicNFT.connect(buyer).buyNFT(0, { value: ethers.parseEther("0.5") }) // Updated to ethers v6 syntax
    ).to.be.revertedWith("Insufficient funds to buy this NFT");
  });


  it("should return the correct NFTs minted by a specific artist", async function () {
    const trackName1 = "Song One";
    const artistName1 = "Artist A";
    const uri1 = "https://example.com/song1";
    const price1 = ethers.parseEther("1");
    const royaltyPercentage1 = 10;

    // Get NFTs by artist
    const artistNFTs = await musicNFT.getNFTsByArtist(artist.address);

    
  });
});
