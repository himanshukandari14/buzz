// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { ethers } from 'ethers';

import config from "../../config.json";
import Factory from "../../abis/Factory.json";

interface WalletContextType {
  account: string | null;
  factory: any;
  isConnecting: boolean;
  nfts: any[]; 
  connectWallet: () => Promise<void>;
  getNFTsgetMusicNFT: () => Promise<void>;
  createNFT: (trackName: string, artistName: string, uri: string, price: string, royaltyPercentage: string) => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [factory, setFactory] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]); 

  const connectWallet = async () => {
    if (isConnecting) return;

    const { ethereum } = window as any;
    if (!ethereum) return alert("Please install MetaMask to use this application.");

    setIsConnecting(true);
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(ethereum);
      const network = await provider.getNetwork();

      const factoryAddress = config[Number(network.chainId)]?.factory?.address;
      if (!factoryAddress) return alert("Unsupported network.");

      const signer = await provider.getSigner();
      setFactory(new ethers.Contract(factoryAddress, Factory, signer));

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
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      const { ethereum } = window as any;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await connectWallet();
        }
      }
    };
    checkConnection();
  }, []);

 const getAllNFTs = async () => {
    if (!factory) {
        console.log("Factory not initialized");
        return;
    }
    try {
        console.log("Calling getAllMusicNFTs on factory:", factory.target);
        
        // Add this line to check the function exists
        console.log("Available functions:", factory.interface.fragments.map(f => f.name));
        
        const nftData = await factory.getAllMusicNFTs();
        console.log("Raw NFT data:", nftData);
        
        // If the data is coming as BigInt or other format, transform it
        const processedData = nftData.map(nft => ({
            trackName: nft.trackName,
            artistName: nft.artistName,
            uri: nft.uri,
            price: ethers.formatEther(nft.price), // Convert from Wei to ETH
            royaltyPercentage: ethers.formatEther(nft.royaltyPercentage)
        }));
        
        console.log("Processed NFT data:", processedData);
        setNfts(processedData);
    } catch (error) {
        console.error("Error details:", error);
        alert("Failed to fetch NFTs. See console for details.");
    }
};
  useEffect(() => {
    if (factory) {
      getAllNFTs();
    }
  }, [factory]);

  const createNFT = async (trackName: string, artistName: string, uri: string, price: string, royaltyPercentage: string) => {
    if (!factory || !account) return;

    try {
        const priceInWei = ethers.parseEther(price);
        const royaltyInWei = BigInt(royaltyPercentage); // Simple percentage value

        console.log("Contract address:", factory.target);
        console.log("Sender address:", account);
        console.log("trackName:", trackName);
        console.log("artistName:", artistName);
        console.log("uri:", uri);
        console.log("priceInWei:", priceInWei.toString());
        console.log("royaltyInWei:", royaltyInWei.toString());

        // Get the signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Get the nonce
        const nonce = await provider.getTransactionCount(account);

        // Create transaction options
        const txOptions = {
            from: account,
            nonce: nonce,
            gasLimit: 300000,
            value: 0
        };

        const tx = await factory.mintNFT(
            trackName, 
            artistName, 
            uri, 
            priceInWei, 
            royaltyInWei,
            txOptions
        );

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);

        return receipt;

    } catch (error: any) {
        console.error("Failed to create NFT:", error);
        // Log the error details
        if (error.error && error.error.message) {
            console.error("Error message:", error.error.message);
        }
        if (error.transaction) {
            console.error("Transaction details:", error.transaction);
        }
        throw error;
    }
  };

  return (
    <WalletContext.Provider value={{ 
      account, 
      factory, 
      isConnecting, 
      connectWallet, 
      nfts, 
      getAllNFTs, 
      createNFT 
    }}>
      {children}
    </WalletContext.Provider>
  );
};