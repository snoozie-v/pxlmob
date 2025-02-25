import  { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { handleWalletConnect } from './WalletConnect';


const TokenBalance = () => {
  const { activeAddress, wallets } = useWallet();
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTokenBalance = async (address) => {
    if (!address) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://mainnet-idx.nautilus.sh/nft-indexer/v1/arc200/balances?contractId=410419`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch token balance');
      }
      const data = await response.json();

      // Find the balance for this address (assuming data.balances is an array)
      const userBalance = data.balances.find((b) => b.accountId === address);
      if (userBalance) {
        // Convert balance from smallest unit (assuming 6 decimals, like the example)
        setBalance(parseInt(userBalance.balance) / 1_000_000);
      } else {
        setBalance(0); // No balance found for this address
      }
    } catch (err) {
      setError('Failed to fetch token balance. Please try again.');
      console.log(err)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeAddress) {
      fetchTokenBalance(activeAddress);
    }
  }, [activeAddress]);

  return (
    <div className="token-balance-container">
      {activeAddress ? (
        <>
          <h3 className="wallet-address">
            Wallet: {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
          </h3>
          {isLoading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}
          {balance !== null && !isLoading && !error && (
            <h3 className="balance">Balance: {balance.toFixed(6)} Tokens</h3>
          )}
          {balance === 0 && !isLoading && !error && (
            <h3 className="no-balance">No tokens found in this wallet.</h3>
          )}
        </>
      ) : (
        <div className="no-wallet">
          <h3>Please connect your wallet to view your token balance.</h3>
          <button id="connect"onClick={() => handleWalletConnect(wallets)}>
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenBalance;