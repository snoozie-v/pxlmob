import React, { useState } from 'react';
import { useWallet, WalletId } from '@txnlab/use-wallet-react';
import { useNavigate } from 'react-router-dom';
import walletImage from '../assets/walletconnect.png';
import navMenu from '../assets/navmenu.png';
import logo2 from '../assets/pxlmob.png';

const Header: React.FC = () => {
  const { activeAddress, wallets } = useWallet();
  const navigate = useNavigate();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleWalletMenu = () => {
    setShowWalletMenu((prev) => !prev);
    setError(null);
  };

  const connectWallet = async (walletId: WalletId) => {
    const wallet = wallets.find((w) => w.id === walletId);
    if (!wallet) {
      console.error(`Wallet ${walletId} not found`);
      setError(`Wallet ${walletId} not available. Please try another.`);
      return;
    }

    try {
      await wallet.connect();
      console.log(`Wallet ${walletId} connected, activeAddress:`, activeAddress);
      setShowWalletMenu(false);
    } catch (error) {
      console.error(`Connection failed for ${walletId}:`, error);
      setError(`Failed to connect ${walletId}. Please try again.`);
    }
  };

  const disconnectWallet = async () => {
    const connectedWallet = wallets.find((w) => w.isConnected);
    if (!connectedWallet) {
      console.error('No connected wallet found');
      setError('No wallet is currently connected.');
      return;
    }

    try {
      await connectedWallet.disconnect();
      console.log('Wallet disconnected');
      setShowWalletMenu(false);
    } catch (error) {
      console.error('Disconnection failed:', error);
      setError('Failed to disconnect wallet. Please try again.');
    }
  };

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
          alt="Wallet connect"
          onClick={toggleWalletMenu}
          className="clickable"
        />
        {showWalletMenu && (
          <div
            style={{
              position: 'absolute',
              top: '60px',
              left: '10px',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1000,
              padding: '0.5rem',
            }}
          >
            {!activeAddress ? (
              <>
                <div
                  className="wallet-menu-item"
                  onClick={() => connectWallet(WalletId.LUTE)}
                  style={{ padding: '0.5rem', cursor: 'pointer' }}
                >
                  Lute
                </div>
                <div
                  className="wallet-menu-item"
                  onClick={() => connectWallet(WalletId.KIBISIS)}
                  style={{ padding: '0.5rem', cursor: 'pointer' }}
                >
                  Kibisis
                </div>
              </>
            ) : (
              <div
                className="wallet-menu-item"
                onClick={disconnectWallet}
                style={{ padding: '0.5rem', cursor: 'pointer' }}
              >
                Disconnect
              </div>
            )}
          </div>
        )}
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
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
};

export default Header;
