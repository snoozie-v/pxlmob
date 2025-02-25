import React from 'react';
import { NetworkId, useWallet, type Wallet } from '@txnlab/use-wallet-react';
import { useNavigate } from 'react-router-dom';
import { handleWalletConnect } from './WalletConnect.js';
import walletImage from '../assets/walletconnect.png';
import navMenu from '../assets/navmenu.png';
import logo2 from '../assets/pxlmob.png';


const Header: React.FC = () => {
  const { activeAddress, setActiveNetwork, wallets } = useWallet();
  const navigate = useNavigate();

  React.useEffect(() => {
    setActiveNetwork(NetworkId.VOIMAIN);
  }, [setActiveNetwork]);

  const handleNavMenuClick = () => {
    navigate('/navigation-menu');
  };

  const handleLogoClick = () => {
    navigate('/'); 
  };

  return (
    <div className="header-container">
      <div className="left">
        <img
          id="walletImage"
          src={walletImage}
          alt="Wallet image"
          onClick={() => handleWalletConnect(wallets)}
          className="clickable"
        />
        {activeAddress && (
          <div className="wallet-address-display">
            {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
          </div>
        )}
      </div>     
      <img 
        id="logo" 
        src={logo2} 
        alt="Pxlmob Logo"
        onClick={handleLogoClick} 
        className="clickable"   
      />
      <div className="right">
        <img
          id="navMenu"
          src={navMenu}
          alt="Nav Menu"
          onClick={handleNavMenuClick}
          className="clickable"
        />
      </div>
    </div>
  );
};

export default Header;