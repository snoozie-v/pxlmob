import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils';

const algorand = AlgorandClient.fromConfig({
  algodConfig: {
    server: 'https://mainnet-api.voi.nodely.dev',
  },
});

const TokenBalance = () => {
  const { activeAddress, transactionSigner } = useWallet();
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txnStatus, setTxnStatus] = useState('');

  const tokenId = 410419; // PiX Token Main Net

  const fetchTokenBalance = async (address) => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://mainnet-idx.nautilus.sh/nft-indexer/v1/arc200/balances?contractId=410419&accountId=${address}`
      );
      if (!response.ok) throw new Error('Failed to fetch token balance');
      const data = await response.json();
      const userBalance = data.balances.find((b) => b.accountId === address);
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
      const transfer = algosdk.ABIMethod.fromSignature('arc200_transfer(address,uint256)bool');
      const result = await algorand
        .newGroup()
        .addAppCallMethodCall({
          sender: activeAddress,
          appId: tokenId,
          method: transfer,
          args: [recipient, Math.round(parseFloat(amount) * 1_000_000)],
        })
        .send({
          populateAppCallResources: true,
        });
      console.log('Transfer sent successfully', result);
      setTxnStatus('Successfully transferred the tokens');
      fetchTokenBalance(activeAddress);
    } catch (error) {
      setError('Transfer failed. Check network, address, or amount.');
      console.error('Transfer error:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeAddress) fetchTokenBalance(activeAddress);
  }, [activeAddress]);

  useEffect(() => {
    if (activeAddress && transactionSigner) {
      algorand.account.setSigner(activeAddress, transactionSigner);
    }
  }, [activeAddress, transactionSigner]);

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
            <h3 className="balance">Balance: {parseFloat(balance).toFixed(0)} Tokens</h3>
          )}
          {balance === '0' && !isLoading && !error && (
            <h3 className="no-balance">No tokens found in this wallet.</h3>
          )}
          <div className="transfer-form">
            <h3>SEND $PiX</h3>
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
          <button
            id="connect"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              document.getElementById('walletImage')?.click();
            }}
            aria-label="Connect wallet"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenBalance;
