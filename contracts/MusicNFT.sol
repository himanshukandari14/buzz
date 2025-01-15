// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct Music {
        string trackName;
        string artistName;
        string uri;
        uint256 price;
        address creator;
        uint256 royaltyPercentage;
    }

    mapping(uint256 => Music) public musicNFTS;
     // Mapping to track balances for each user
    mapping(address => uint256) public balances;

    mapping (address => uint256[]) private artistToNFTs;
    // Mapping from artist address to NFT IDs

    event MusicMinted(
        uint256 tokenId,
        string trackName,
        string artistName,
        string uri,
        uint256 price
    );

    constructor() ERC721("MusicNFT", "MNFT") Ownable(msg.sender) {}

    function mintNFT(
        string memory trackName,
        string memory artistName,
        string memory uri,
        uint256 price,
        uint256 royaltyPercentage
    ) external {
        require(
            royaltyPercentage <= 25,
            "Royalty percentage cannot exceed 25%"
        );
        uint256 tokenId = _tokenIdCounter;
        _mint(msg.sender, tokenId);
        musicNFTS[tokenId] = Music(
            trackName,
            artistName,
            uri,
            price,
            msg.sender,
            royaltyPercentage
        );
        _tokenIdCounter++;
        emit MusicMinted(tokenId, trackName, artistName, uri, price);
    }

    function getMusicNFT(uint256 tokenId) external view returns (Music memory) {
        return musicNFTS[tokenId];
    }


// Add to MusicNFT contract
function totalSupply() external view returns (uint256) {
    return _tokenIdCounter;
}
   function getAllMusicNFTs() external view returns (Music[] memory) {
    uint256 totalNFTs = _tokenIdCounter;
    Music[] memory allNFTs = new Music[](totalNFTs);

    for (uint256 i = 0; i < totalNFTs; i++) {
        allNFTs[i] = musicNFTS[i];
    }

    return allNFTs;
}


    function setPrice(uint256 tokenId, uint256 price) external payable {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        musicNFTS[tokenId].price = price;
    }

    function buyNFT(uint256 tokenId) external payable {
    Music memory music = musicNFTS[tokenId];
    require(msg.value >= music.price, "Insufficient funds to buy this NFT");

    address owner = ownerOf(tokenId);

    // transfer the NFT
    _transfer(owner, msg.sender, tokenId);

    // Calculate royalty based on actual payment amount
    uint256 royaltyAmount = (msg.value * music.royaltyPercentage) / 100;
    
    // Transfer royalty to creator
    payable(music.creator).transfer(royaltyAmount);
    
    // Transfer remaining amount to current owner
    payable(owner).transfer(msg.value - royaltyAmount);
}


    function getNFTsByArtist(address artist) public view returns (uint256[] memory){
        return artistToNFTs[artist];
    }

}
