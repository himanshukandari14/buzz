// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useContext, useState } from "react";
import Heading from "../components/headerComponents/Heading";
import uploadToIPFS from '../../utility/pinataUpload';
import { WalletContext } from "../context/WalletContext";

const Mint = () => {
  const walletContext = useContext(WalletContext);
  const {createNFT} = walletContext || {};
  const [trackName, setTrackName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [musicFile, setMusicFile] = useState(null);
  const [price, setPrice] = useState("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [uri, setUri] = useState("");

   const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
  console.log(PINATA_API_KEY, PINATA_SECRET_API_KEY);

  const handleMint = async () => {
    
    if (!musicFile) return alert("Please upload a music file before minting.");

    try {
      // Upload the music file to IPFS
      const ipfsHash = await uploadToIPFS(musicFile);
      const uri = `ipfs://${ipfsHash}`;
      
      // Call your smart contract minting function here
      // Example: const tx = await nftContract.mintNFT(trackName, artistName, uri, price, royaltyPercentage);

     const tx = await createNFT(trackName, artistName, uri, price, royaltyPercentage);
        console.log("Minting NFT...");
        console.log({ trackName, artistName, uri, price, royaltyPercentage });
        console.log(tx); // You can log the transaction result here

      // Close the popup after minting
      setShowPopup(false);
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT.");
    }
  };

  const handleOpenPopup = () => {
    setShowPopup(true); // Show the popup
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="h-screen w-full bg-black text-white px-6">
      <Heading title="Mint NFT" />
      <div className="flex justify-center items-center mt-10">
        <button
          onClick={handleOpenPopup}
          className="text-[#000000] h-[200px] w-[400px] hover:text-[#ffffff] hover:bg-[#4a4a4a] 0.3s transition bg-[#ffff] text-[3rem] rounded-[100px] px-6 py-3 font-bold"
        >
          Mint Now
        </button>
      </div>

      {showPopup && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white text-black rounded-lg p-8 w-[80%] md:w-[50%] lg:w-[30%] shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
          >
            <h2 className="text-2xl font-bold text-center mb-6">Upload Your Music NFT</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="trackName">Track Name</label>
                <input
                  type="text"
                  id="trackName"
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  placeholder="Enter track name"
                  className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="artistName">Artist Name</label>
                <input
                  type="text"
                  id="artistName"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Enter artist name"
                  className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="musicFile">Music File</label>
                <input
                  type="file"
                  id="musicFile"
                  accept="audio/*"
                  onChange={(e) => setMusicFile(e.target.files[0])} // Store the file
                  className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="price">Price (ETH)</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="royaltyPercentage">Royalty Percentage</label>
                <input
                  type="number"
                  id="royaltyPercentage"
                  value={royaltyPercentage}
                  onChange={(e) => setRoyaltyPercentage(e.target.value)}
                  placeholder="Enter royalty percentage (max 25%)"
                  className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  max="25"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  onClick={handleMint}
                  className="bg-[#000000] text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-[#4a4a4a] transition duration-300"
                >
                  Mint Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mint;