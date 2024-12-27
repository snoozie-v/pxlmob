import { useState } from 'react'
import './App.css'

import { useEffect } from 'react';

// import Transaction from './components/Transaction';
import NFTDashboard from './components/NFTDashboard';
import RandomNFTDisplay from './components/RandomNFTDisplay';



function App() {

  
  return (
    <>
      <h1>PXLMOB</h1>
      <p>Make NFTs Great Again.</p>
      <RandomNFTDisplay />
      <h2>PXLMOB have landed.</h2>
      <p>999 PXL Minotaurs forged on the VOI Network.
      </p>
      <p>They may be cute but these little Minos pack a punch!!</p>
      <NFTDashboard />
    </>
  )
}

export default App
