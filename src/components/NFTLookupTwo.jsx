import React, { useState, useEffect, useContext } from 'react';
import WalletContext from './WalletContext'; // Adjust path as necessary

const NFTLookupTwo = () => {
  const { activeAddress } = useContext(WalletContext);
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch NFTs
  const fetchNFTs = async (address) => {
    if (!address) return; // Don't fetch if no address is provided

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens?contractId=447482&owner=${address}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('data', data);
      setNFTs(data.tokens);
    } catch (err) {
      setError('Failed to fetch NFTs. Please check the wallet address.');
    }
    setIsLoading(false);
  };

  // Effect to fetch NFTs when activeAddress changes
  useEffect(() => {
    if (activeAddress) {
      fetchNFTs(activeAddress);
    }
  }, [activeAddress]);

  return (
    <div>
      <hr />
      {activeAddress ? (
        <>
          <p>Looking up NFTs for address: {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}</p>
          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          
          {nfts.length > 0 && (
             <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', listStyle: 'none', padding: 0 }}>
              {nfts.map((nft, index) => {
                let metadata = {};
                try {
                  metadata = JSON.parse(nft.metadata);
                  console.log('meta', metadata);
                } catch (error) {
                  console.error('Failed to parse metadata for NFT at index', index, error);
                }
  
                return (
                  <li key={index} style={{
                    display: 'flex',
                    flexDirection: 'column', // Stack items vertically
                    alignItems: 'center', // Center items horizontally
                    textAlign: 'center', // Center text
                    margin: '10px',
                  }}>
                    <p style={{ margin: 0 }}>Token ID: {nft.tokenId || 'Unknown'}</p>
                    {metadata.image ? (
                      <img src={metadata.image} alt={`NFT ${nft.tokenId}`} style={{ 
                        width: '100px', 
                        height: '100px', 
                        border: '5px solid',
                        marginTop: '5px' // Add some space between text and image
                      }} />
                    ) : (
                      <span>Image: Unknown</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {nfts.length === 0 && !isLoading && !error && <p>No NFTs found for this address.</p>}
        </>
      ) : (
        <p>Please connect your wallet to view your PXLMOB NFTs.</p>
      )}
      <hr />
    </div>
  );
};

export default NFTLookupTwo;