import  { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { handleWalletConnect } from './WalletConnect';


const NFTLookupTwo = () => {
  const { activeAddress, wallets } = useWallet();
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNFTs = async (address) => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens?contractId=447482&owner=${address}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setNFTs(data.tokens || []);
    } catch (err) {
      setError('Failed to fetch NFTs. Please check the wallet address.');
      console.log(err)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeAddress) fetchNFTs(activeAddress);
  }, [activeAddress]);

  return (
    <div>
      <hr />
      {activeAddress ? (
        <>
          <h3>
            Looking up NFTs for address: {activeAddress.slice(0, 6)}...
            {activeAddress.slice(-4)}
          </h3>
          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {nfts.length > 0 && (
            <ul className="nft-list">
              {nfts.map((nft, index) => {
                let metadata = {};
                try {
                  metadata = JSON.parse(nft.metadata);
                } catch (error) {
                  console.error('Failed to parse metadata for NFT at index', index, error);
                }
                return (
                  <li key={index} className="nft-item">
                    <a
                      href={`https://nftnavigator.xyz/collection/447482/token/${nft.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nft-link"
                    >
                      <p className="nft-token-id">Token ID: {nft.tokenId || 'Unknown'}</p>
                      {metadata.image ? (
                        <img
                          src={metadata.image}
                          alt={`NFT ${nft.tokenId}`}
                          className="nft-image"
                        />
                      ) : (
                        <span className="nft-no-image">Image: Unknown</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          {nfts.length === 0 && !isLoading && !error && (
            <p>No NFTs found for this address.</p>
          )}
        </>
      ) : (
        <div className="no-wallet">
          <h3>Please connect your wallet to view your PXLMOB NFTs.</h3>
          <button id="connect" onClick={() => handleWalletConnect(wallets)}>Connect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default NFTLookupTwo;