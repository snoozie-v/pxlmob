import React from 'react';
import { NetworkId, WalletId, useWallet, type Wallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import logo from '../assets/pxlmoblogo.jpg';
import walletImage from '../assets/walletconnect.png';
import navMenu from '../assets/navmenu.png';
import logo2 from '../assets/logo2.png';

const Header: React.FC = () => {
  const {
    algodClient,
    activeAddress,
    activeNetwork,
    setActiveNetwork,
    transactionSigner,
    wallets
  } = useWallet();

  setActiveNetwork(NetworkId.VOIMAIN)

  const setActiveAccount = (event: React.ChangeEvent<HTMLSelectElement>, wallet: Wallet) => {
    const target = event.target
    wallet.setActiveAccount(target.value)
  }

  const handleWalletConnect = () => {
    console.log(algodClient)
    // Assuming the first wallet in the list is the one to interact with for simplicity
    if (wallets.length > 0) {
      const wallet = wallets[0];
      if (!wallet.isConnected) {
        wallet.connect().then(() => {
          console.log('Successfully connected');
        }).catch((error) => {
          console.error('Failed to connect:', error);
        });
      } else {
        wallet.disconnect();
      }
    }
  };

  return (
    <div className='header-container'>
      <img id="logo" src={logo2} alt="Pxlmob Logo" />
      <div className='right-cons'>
        <img 
          id="walletImage" 
          src={walletImage} 
          alt="Wallet image" 
          onClick={handleWalletConnect}
          style={{ cursor: 'pointer' }}
        />
        <img id="navMenu" src={navMenu} alt="Nav Menu" />
      </div>
      {/* Optional: Display network status or connected wallet address */}
      {activeAddress && (
        <div style={{ color: 'white', position: 'absolute', right: '10px', top: '25px', fontSize: '12px' }}>
          Address: {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)} | Network: {activeNetwork}
        </div>
      )}
    </div>
  );
};

export default Header;