import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Punks from "../components/Punks";
import CTA from "../components/CTA";
import config from "../../config.json";
import Factory from "../../abis/Factory.json";

const Home = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [factory, setFactory] = useState<any>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [nfts, setNfts] = useState([]);

  // Function to connect the wallet
  const connectWallet = async () => {
    if (isConnecting) return; // Prevent multiple clicks during connection

    const { ethereum } = window;
    if (!ethereum) return alert("Please install MetaMask to use this application.");

    setIsConnecting(true); // Set connecting state to true
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(ethereum);
      const network = await provider.getNetwork();

      const factoryAddress = config[network.chainId]?.factory?.address;
      if (!factoryAddress) return alert("Unsupported network.");

      const signer = await provider.getSigner();
      setFactory(new ethers.Contract(factoryAddress, Factory, signer));
        console.log(factory,"fac")

      ethereum.on("accountsChanged", (newAccounts: string[]) => setAccount(newAccounts[0]));
      ethereum.on("chainChanged", () => window.location.reload());
    } catch (error: any) {
      alert(
        error.code === -32002
          ? "A request is already pending in MetaMask."
          : "Failed to connect to blockchain. Please try again."
      );
      console.error("Error:", error);
    } finally {
      setIsConnecting(false); // Reset connecting state
    }
  };


  

  // Automatically connect wallet if already connected
  useEffect(() => {
    
    const checkConnection = async () => {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await connectWallet(); // Automatically set up provider and contracts
        }
      }
    };
    checkConnection();
   
  }, []);

  return (
    <div className="bg-black w-screen text-white py-4">
      <Navbar
       
        account={account}
        connectWallet={connectWallet}
        isConnecting={isConnecting}
        factory={factory}
      />
      <Hero />
      <Punks />
      <CTA />
    </div>
  );
};

export default Home;
