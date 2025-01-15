import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ account, isConnecting, connectWallet }) => {
  const navigate = useNavigate();
  

  const navigateCollection = () => {
    // Navigate to /collection and pass factory via state
    navigate("/collection");
  };


  return (
    <div className="flex justify-between items-center px-[15%] font-bold py-4 bg-black text-white">
      <div className="text-[2rem]">Buzz</div>
      <div className="flex justify-center gap-10 items-center">
        <h1>About</h1>
        <h1 onClick={navigateCollection}>Collection</h1> {/* Call navigateCollection on click */}
        <h1>FAQ</h1>

        {/* Wallet Button */}
        <button
          onClick={connectWallet}
          className={`text-[#c4ebff] hover:text-black hover:bg-white transition duration-300 bg-[#0a2b3b] text-[1rem] rounded-[100px] px-6 py-3 ${isConnecting || account ? "cursor-not-allowed" : "cursor-pointer"}`}
          disabled={isConnecting || account} // Disable button if connecting or already connected
        >
          {isConnecting
            ? "Connecting..."
            : account
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
