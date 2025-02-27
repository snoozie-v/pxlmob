import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { handleWalletConnect } from './WalletConnect';
import algosdk from 'algosdk';
import { arc200 as Contract } from 'ulujs';

// Algod client setup
const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.voi.nodely.dev', '');

const TokenBalance: React.FC = () => {
  const { activeAddress, wallets, signTransactions } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txnStatus, setTxnStatus] = useState('');

  const fetchTokenBalance = async (address: string | undefined) => {
    if (!address) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://mainnet-idx.nautilus.sh/nft-indexer/v1/arc200/balances?contractId=410419&accountId=${address}`
      );
      if (!response.ok) throw new Error('Failed to fetch token balance');
      const data = await response.json();
      const userBalance = data.balances.find((b: any) => b.accountId === address);
      setBalance(userBalance ? (parseInt(userBalance.balance) / 1_000_000).toString() : '0');
    } catch (err) {
      setError('Failed to fetch token balance. Please try again.');
      console.error(err);
    }
    setIsLoading(false);
  };

  const transferTokens = async () => {
    if (!activeAddress || !recipient || !amount) {
      setTxnStatus('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxnStatus('');

    try {
      const contract = new Contract(410419, algodClient, algodClient, {
        acc: { addr: activeAddress, sk: new Uint8Array() } // No private key needed for signing
      });
      const amountInSmallestUnit = Math.round(parseFloat(amount) * 1_000_000);
      const resp = await contract.arc200_transfer(recipient, BigInt(amountInSmallestUnit), true, false);

      if (!resp.success || !resp.txns) {
        throw new Error('Failed to build ARC-200 transaction');
      }

      const txnsForSigning = resp.txns.map((txn: string) => new Uint8Array(atob(txn).split('').map(c => c.charCodeAt(0))));
      
      const signedTxns = await signTransactions(txnsForSigning);
      const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
      setTxnStatus(`Transaction sent! TxID: ${txId}`);

      await algosdk.waitForConfirmation(algodClient, txId, 4);
      setTxnStatus('Transfer successful!');
      fetchTokenBalance(activeAddress);
    } catch (err) {
      setError('Transfer failed. Check network, address, or amount.');
      console.error('Transfer error:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeAddress) fetchTokenBalance(activeAddress);
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
            <h3 className="balance">Balance: {parseFloat(balance).toFixed(6)} Tokens</h3>
          )}
          {balance === '0' && !isLoading && !error && (
            <h3 className="no-balance">No tokens found in this wallet.</h3>
          )}

          <div className="transfer-form">
            <h3>Transfer Tokens</h3>
            <input
              type="text"
              id="transfer-address"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              type="number"
              id="transfer-amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
            />
            <button id="transfer-button" onClick={transferTokens} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Transfer'}
            </button>
            {txnStatus && <p className="txn-status">{txnStatus}</p>}
          </div>
        </>
      ) : (
        <div className="no-wallet">
          <h3>Please connect your wallet to view your token balance.</h3>
          <button id="connect" onClick={() => handleWalletConnect(wallets)}>
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenBalance;