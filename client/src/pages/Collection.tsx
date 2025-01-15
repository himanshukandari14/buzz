import { useContext, useEffect } from "react";
import Heading from "../components/headerComponents/Heading";
import { WalletContext } from "../context/WalletContext";

const Collection = () => {
    const walletContext = useContext(WalletContext);
    const { nfts, getAllNFTs, factory } = walletContext || {};

    useEffect(() => {
        if (factory) {
            getAllNFTs();
        }
    }, [factory]);

    console.log("Factory:", factory?.target);
    console.log("NFTs:", nfts);

    return (
        <div className="min-h-screen w-full bg-black text-white px-6 py-12">
            <Heading title="Collection" />
            <div className="max-w-7xl mx-auto">
                {/* Show message when the wallet is not connected */}
                {!factory && (
                    <div className="text-center py-16">
                        <p className="text-2xl font-semibold text-gray-300">
                            Please connect your wallet to view your collection
                        </p>
                    </div>
                )}

                {/* Show message when no NFTs are found */}
                {factory && nfts?.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-2xl font-semibold text-gray-300">
                            No NFTs found in your collection
                        </p>
                    </div>
                )}

                {/* Display NFTs */}
                {nfts?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                        {nfts.map((nft, index) => (
                            <div
                                key={index}
                                className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md transform hover:scale-105 transition-transform duration-300"
                            >
                                <p className="text-lg font-bold text-white truncate">
                                    Track: {nft.trackName || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-400 truncate mt-1">
                                    Artist: {nft.artistName || "Unknown"}
                                </p>
                                {nft.uri && (
                                    <div className="mt-4">
                                        <img
                                            src={nft.uri}
                                            alt={`NFT ${index}`}
                                            className="rounded-md object-cover w-full h-40"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;
