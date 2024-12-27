import React, { useState, useEffect } from 'react';

const NFTLookup = ({ target }) => {
  // State for wallet address input
  const [walletAddress, setWalletAddress] = useState(target || '');
  // State for NFTs fetched from the API
  const [nfts, setNFTs] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  // State for error handling
  const [error, setError] = useState(null);

  // Function to handle changes in the input field
  const handleWalletChange = (event) => {
    setWalletAddress(event.target.value);
    console.log('set wallet', event.target.value);
  };

  // Function to fetch NFTs
  const fetchNFTs = async () => {
    if (!walletAddress) return; // Don't fetch if no address is provided

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens?owner=${walletAddress}`);
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

  // Effect to fetch NFTs when walletAddress or target changes
  useEffect(() => {
    setWalletAddress(target || ''); // Update walletAddress when target changes
    fetchNFTs();
  }, [target]); // Depend on target to trigger when it changes

  return (
    <div>
<hr />
      <input 
        type="text" 
        value={walletAddress} 
        onChange={handleWalletChange} 
        placeholder="Enter wallet address"
      />
      <button onClick={fetchNFTs}>Lookup NFTs</button>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      
      {nfts.length > 0 && (
        <ul>
          {nfts.map((nft, index) => {
            // Parse the metadata string to a JavaScript object
            let metadata = {};
            try {
              metadata = JSON.parse(nft.metadata);
              console.log('meta', metadata);
            } catch (error) {
              // If parsing fails, metadata remains an empty object and we'll show 'Unnamed'
              console.error('Failed to parse metadata for NFT at index', index, error);
            }

            return (
              <li key={index}>
                Token ID: {nft.tokenId || 'Unknown'},
                {metadata.image ? (
                  <img src={metadata.image} alt={`NFT ${nft.tokenId}`} style={{ width: '100px', height: '100px' }} />
                ) : (
                  <span>Image: Unknown</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {nfts.length === 0 && !isLoading && !error && <p>No NFTs found for this address.</p>}
      <p>The current address is {walletAddress}</p>
      <hr />
    </div>
  );
};

export default NFTLookup;