import React, { useState } from 'react';
import NFTHolderStats from './NFTHolderStats';
import NFTLookup from './NFTLookup';

const NFTDashboard = () => {
  const [selectedAddress, setSelectedAddress] = useState('');

  return (
    <div>
      <NFTLookup target={selectedAddress} />
      <NFTHolderStats setSelectedAddress={setSelectedAddress} />

    </div>
  );
};

export default NFTDashboard;