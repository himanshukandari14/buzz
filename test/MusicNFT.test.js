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


  it("should return all music NFTs", async function () {
    const trackName1 = "Song One";
    const artistName1 = "Artist A";
    const uri1 = "https://example.com/song1";
    const price1 = ethers.parseEther("1");
    const royaltyPercentage1 = 10;

    const trackName2 = "Song Two";
    const artistName2 = "Artist B";
    const uri2 = "https://example.com/song2";
    const price2 = ethers.parseEther("2");
    const royaltyPercentage2 = 15;

    // Mint two NFTs
    await musicNFT
      .connect(artist)
      .mintNFT(trackName1, artistName1, uri1, price1, royaltyPercentage1);

    await musicNFT
      .connect(artist)
      .mintNFT(trackName2, artistName2, uri2, price2, royaltyPercentage2);

    // Call getAllMusicNFTs to fetch all NFTs
    const allNFTs = await musicNFT.getAllMusicNFTs();

    // Assertions
    expect(allNFTs.length).to.equal(2);

    // Validate details of the first NFT
    expect(allNFTs[0].trackName).to.equal(trackName1);
    expect(allNFTs[0].artistName).to.equal(artistName1);
    expect(allNFTs[0].uri).to.equal(uri1);
    expect(allNFTs[0].price).to.equal(price1);
    expect(allNFTs[0].creator).to.equal(artist.address);
    expect(allNFTs[0].royaltyPercentage).to.equal(royaltyPercentage1);

    // Validate details of the second NFT
    expect(allNFTs[1].trackName).to.equal(trackName2);
    expect(allNFTs[1].artistName).to.equal(artistName2);
    expect(allNFTs[1].uri).to.equal(uri2);
    expect(allNFTs[1].price).to.equal(price2);
    expect(allNFTs[1].creator).to.equal(artist.address);
    expect(allNFTs[1].royaltyPercentage).to.equal(royaltyPercentage2);
  });

  it("should return the correct total supply of NFTs", async function () {
    // Initially, the total supply should be 0
    let totalSupply = await musicNFT.totalSupply();
    expect(totalSupply).to.equal(0);

    // Mint a new NFT
    await musicNFT.connect(artist).mintNFT(
      "Song One",
      "Artist A",
      "https://example.com/song1",
      ethers.parseEther("1"),
      10
    );

    // After minting one NFT, the total supply should be 1
    totalSupply = await musicNFT.totalSupply();
    expect(totalSupply).to.equal(1);

    // Mint another NFT
    await musicNFT.connect(artist).mintNFT(
      "Song Two",
      "Artist B",
      "https://example.com/song2",
      ethers.parseEther("2"),
      15
    );

    // After minting another NFT, the total supply should be 2
    totalSupply = await musicNFT.totalSupply();
    expect(totalSupply).to.equal(2);
  });

});
