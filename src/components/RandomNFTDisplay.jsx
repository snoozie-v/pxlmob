import React, { useState, useEffect } from 'react';

const RandomNFTDisplay = () => {
  const [randomNFT, setRandomNFT] = useState(true)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Assuming there are 735 NFTs to choose from
  const totalNFTs = 735;

  const fetchRandomNFT = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate a random number between 1 and 735 (inclusive)
      const randomIndex = Math.floor(Math.random() * totalNFTs) + 1;
    //   console.log('randomIndex', randomIndex)
      // Assuming you have an API endpoint that can fetch by index or token ID
      const response = await fetch(`https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens?contractId=447482&tokenId=${randomIndex}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Assuming the 'data' contains metadata for the NFT
      if (data.tokens[0].metadataURI) {
        let metadata = {} ;
        try {
          metadata = JSON.parse(data.tokens[0].metadata);
          console.log('metadata', metadata, metadata.image)
          if (metadata) {
            setRandomNFT(metadata.image);
          } else {
            throw new Error('No image found in metadata');
          }
        } catch (error) {
          console.error('Failed to parse or find image in metadata:', error);
          setError('Failed to fetch or parse NFT image.');
        }
      } else {
        throw new Error('No metadata found for this NFT');
      }
    } catch (err) {
      setError(`Failed to fetch NFT: ${err.message}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRandomNFT();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {randomNFT ? (
        <img 
          src={randomNFT} 
          alt="Random NFT" 
          style={{ width: '300px', height: '300px' }}
        />
      ) : (
        <p>No NFT image to display.</p>
      )}
    </div>
  );
};

export default RandomNFTDisplay;