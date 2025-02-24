import React from 'react';
import { NetworkId, WalletId, useWallet, type Wallet } from '@txnlab/use-wallet-react';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory to useNavigate
import { handleWalletConnect} from './WalletConnect.js'
import walletImage from '../assets/walletconnect.png';
import navMenu from '../assets/navmenu.png';
import logo2 from '../assets/pxlmob.png';

const Header: React.FC = () => {
  const { activeAddress, setActiveNetwork, wallets } = useWallet();

  const navigate = useNavigate(); // Changed from useHistory to useNavigate

  // Set the network once when the component mounts
  React.useEffect(() => {
    setActiveNetwork(NetworkId.VOIMAIN);
  }, [setActiveNetwork]);

  const handleNavMenuClick = () => {
    navigate('/navigation-menu');
  };

  return (
    <div className='header-container'>
      <div className='left'>
        <img 
            id="walletImage" 
            src={walletImage} 
            alt="Wallet image" 
            onClick={() => handleWalletConnect(wallets)}
            style={{ cursor: 'pointer' }}
          />
        {activeAddress && (
          <div style={{ color: 'white',  fontSize: '12px' }}>
            {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)} 
          </div>
        )}
      </div>
      <img id="logo" src={logo2} alt="Pxlmob Logo"  />
      
      <div className='right'>
        
        <img 
          id="navMenu" 
          src={navMenu} 
          alt="Nav Menu" 
          onClick={handleNavMenuClick} // Add onClick here
          style={{ cursor: 'pointer' }} // Change cursor to indicate it's clickable
        />
      </div>


    </div>
  );
};

export default Header;