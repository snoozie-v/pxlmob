import { useState, useEffect } from 'react';
import algosdk from 'algosdk';
import { useWallet } from '@txnlab/use-wallet-react';
import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import Header from './Header';
import Footer from './Footer';
import tokenImg from '../assets/pixToken.jpg';

const algorand = AlgorandClient.fromConfig({
  algodConfig: {
    server: 'https://mainnet-api.voi.nodely.dev',
  },
});

const pxlmobID = 447482;

function Recycler() {
  const { activeAddress, transactionSigner } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (activeAddress && transactionSigner) {
      algorand.account.setSigner(activeAddress, transactionSigner);
    }
  }, [activeAddress, transactionSigner]);

  const transferToken = async (recipient, tokenId) => {
    try {
      const transfer = algosdk.ABIMethod.fromSignature('arc72_transferFrom(address,address,uint256)void');
      const result = await algorand
        .newGroup()
        .addAppCallMethodCall({
          sender: activeAddress,
          appId: pxlmobID,
          method: transfer,
          args: [activeAddress, recipient, tokenId],
        })
        .send({
          populateAppCallResources: true,
        });
      console.log('Approval result:', result);
      setStatus(`Transfer successful! TxID: ${result.txIds[0]}`);
    } catch (error) {
      console.error('Transfer error:', error);
      setStatus(`Transfer failed: ${error.message}`);
    }
  };

  const handleTransfer = () => {
    if (!activeAddress) {
      setStatus('Please connect your wallet');
      return;
    }
    if (!algosdk.isValidAddress(recipient)) {
      setStatus('Invalid recipient address');
      return;
    }
    if (!tokenId || isNaN(tokenId)) {
      setStatus('Invalid token ID');
      return;
    }
    transferToken(recipient, parseInt(tokenId));
  };

  return (
    <div className="container">
      <Header />
      <main>
        <h1>Recycler - ARC-72 NFT Transfer</h1>
        <div className="transfer-section">
          <h2>Transfer PXLmob NFT</h2>
          <div className="form-group">
            <label htmlFor="recipient">Recipient Address</label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient wallet address"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tokenId">Token ID</label>
            <input
              type="number"
              id="tokenId"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter token ID"
              className="form-control"
            />
          </div>
          <button
            onClick={handleTransfer}
            disabled={!activeAddress || !recipient || !tokenId}
            className="btn btn-primary"
          >
            Transfer NFT
          </button>
          {status && <div className="status-message">{status}</div>}
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .transfer-section {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-control {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .btn-primary {
          background: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-primary:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
        .status-message {
          margin-top: 15px;
          padding: 10px;
          border-radius: 4px;
          background: #e7f3ff;
        }
      `}</style>
    </div>
  );
}

export default Recycler;
