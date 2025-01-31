import React from 'react';
import { NetworkId, WalletId, useWallet, type Wallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory to useNavigate
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

  const navigate = useNavigate(); // Changed from useHistory to useNavigate

  // Set the network once when the component mounts
  React.useEffect(() => {
    setActiveNetwork(NetworkId.VOIMAIN);
  }, [setActiveNetwork]);

  const setActiveAccount = (event: React.ChangeEvent<HTMLSelectElement>, wallet: Wallet) => {
    const target = event.target;
    wallet.setActiveAccount(target.value);
  }

  const handleWalletConnect = () => {
    console.log(algodClient);
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

  // Function to handle navigation when navMenu is clicked
  const handleNavMenuClick = () => {
    // Navigate to a new route where your menu or modal can be shown
    navigate('/navigation-menu');
  };

  return (
    <div className='header-container'>
      <img id="logo" src={logo2} alt="Pxlmob Logo" style={{border: '10px solid #333'}} />
      <div className='right-cons'>
        <img 
          id="walletImage" 
          src={walletImage} 
          alt="Wallet image" 
          onClick={handleWalletConnect}
          style={{ cursor: 'pointer' }}
        />
        <img 
          id="navMenu" 
          src={navMenu} 
          alt="Nav Menu" 
          onClick={handleNavMenuClick} // Add onClick here
          style={{ cursor: 'pointer' }} // Change cursor to indicate it's clickable
        />
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