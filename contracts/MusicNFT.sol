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
    }

    mapping(uint256 => Music) public musicNFTS;

    event MusicMinted(uint256 tokenId, string trackName, string artistName, string uri, uint256 price);

    constructor() ERC721("MusicNFT", "MNFT") Ownable(msg.sender) {}

    function mintNFT(
        string memory trackName,
        string memory artistName,
        string memory uri,
        uint256 price
    ) external {
        uint256 tokenId = _tokenIdCounter;
        _mint(msg.sender, tokenId); 
        musicNFTS[tokenId] = Music(trackName, artistName, uri, price);
        _tokenIdCounter++;
        emit MusicMinted(tokenId, trackName, artistName, uri, price);
    }

    function getMusicNFT(uint256 tokenId) external view returns (Music memory) {
        return musicNFTS[tokenId];
    }
}