import { useContext, useEffect } from "react";
import { WalletContext } from '../context/WalletContext'; // Adjust the path according to your structure
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Punks from "../components/Punks";
import CTA from "../components/CTA";

const Home = () => {
  const walletContext = useContext(WalletContext);

  if (!walletContext) return null; // Handle case when context is not available

  const { account, factory, isConnecting, connectWallet } = walletContext;

  // Automatically connect wallet if already connected
  useEffect(() => {
    const checkConnection = async () => {
      const { ethereum } = window as any;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0 && !account) {
          await connectWallet(); // Automatically connect if an account is found and the wallet is not already connected
        }
      }
    };
  
    checkConnection();
  }, [connectWallet, account]); // Add account as a dependency

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