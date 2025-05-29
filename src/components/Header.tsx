import React, { useState, useEffect } from 'react';
import { useWallet, WalletId } from '@txnlab/use-wallet-react';
import { useNavigate } from 'react-router-dom';
import { createPopper } from '@popperjs/core';
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
    setError(null); // Clear error on wallet image click
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
      setError(null); // Clear error on successful connection
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
      setError(null); // Clear error on successful disconnection
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

  // Dynamic positioning with popper.js
  useEffect(() => {
    if (showWalletMenu) {
      const walletImageEl = document.getElementById('walletImage');
      const menu = document.getElementById('walletMenu');
      if (walletImageEl && menu) {
        createPopper(walletImageEl, menu, {
          placement: 'bottom-start',
          modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
        });
      }
    }
  }, [showWalletMenu]);

  return (
    <div className="header-container">
      <div className="left">
        <img
          id="walletImage"
          src={walletImage}
          alt="Wallet connect"
          onClick={toggleWalletMenu}
          className="wallet-image clickable"
        />
        {showWalletMenu && (
          <>
            <div className="wallet-menu-overlay" onClick={toggleWalletMenu} />
            <div id="walletMenu" className="wallet-menu" role="menu" aria-labelledby="walletImage">
              <button
                className="wallet-menu-close"
                onClick={toggleWalletMenu}
                aria-label="Close wallet menu"
              >
                ✕
              </button>
              <ul>
                {!activeAddress ? (
                  <>
                    <li
                      className="wallet-menu-item"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => connectWallet(WalletId.LUTE)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          connectWallet(WalletId.LUTE);
                        }
                      }}
                    >
                      Lute
                    </li>
                    <li
                      className="wallet-menu-item"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => connectWallet(WalletId.KIBISIS)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          connectWallet(WalletId.KIBISIS);
                        }
                      }}
                    >
                      Kibisis
                    </li>
                  </>
                ) : (
                  <li
                    className="wallet-menu-item"
                    role="menuitem"
                    tabIndex={0}
                    onClick={disconnectWallet}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        disconnectWallet();
                      }
                    }}
                  >
                    Disconnect
                  </li>
                )}
              </ul>
            </div>
          </>
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
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Header;
