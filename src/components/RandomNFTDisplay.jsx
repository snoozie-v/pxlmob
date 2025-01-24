import React, { useState, useEffect } from 'react';

const RandomNFTDisplay = () => {
  const [randomNFT, setRandomNFT] = useState(true)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalNFTs, setTotalNFTs] = useState(0)

  const fetchTotalNFTs = async () => {
    try {
      const response = await fetch(`https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens?contractId=447482`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTotalNFTs(data.tokens.length)
      console.log(totalNFTs)
    } catch (err) {
      setError(`Failed to fetch total number of NFTs: ${err.message}`);
    }
  };

  const fetchRandomNFT = async () => {
    setIsLoading(true);
    setError(null);
    let randomIndex;
    
    try {
      // Generate a random number between 1 and 765 (inclusive)
      randomIndex = Math.floor(Math.random() * totalNFTs) + 1;
      // Fetching NFT by token ID
      const response = await fetch(`https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens?contractId=447482&tokenId=${randomIndex}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Assuming the 'data' contains metadata for the NFT
      if (data.tokens.length > 0) {

        let metadata = {} ;
        metadata.tokenId = data.tokens[0].tokenId
        try {
          // Parse the existing metadata if available
          const parsedMetadata = JSON.parse(data.tokens[0].metadata);
          metadata = { ...metadata, ...parsedMetadata };
          console.log('metadata', metadata, metadata.image, metadata.tokenId);
  
          if (metadata.image) {
            setRandomNFT(metadata);
          } else {
            throw new Error('No image found in metadata');
          }
        } catch (error) {
          console.error('Failed to parse or find image in metadata:', error);
          setError('Failed to fetch or parse NFT image.');
        }
      } else {
        throw new Error('No tokens found for this NFT');
      }
    } catch (err) {
      setError(`Failed to fetch NFT: ${err.message}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTotalNFTs().then(() => {
      // Only fetch the random NFT if we have the total count
      if (totalNFTs > 0) {
        fetchRandomNFT();
      }
    });
  }, [totalNFTs]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {randomNFT ? (
        <> 
          <img 
            src={randomNFT.image} 
            alt={`NFT ${randomNFT.tokenId}`} 
            style={{ width: '400px', height: '400px', border: '10px solid #333', padding: '0px' }}
          />
          <p>Token ID: {randomNFT.tokenId}</p>
        </>
      ) : (
        <p>No NFT image to display.</p>
      )}
    </div>
  );
};

export default RandomNFTDisplay;