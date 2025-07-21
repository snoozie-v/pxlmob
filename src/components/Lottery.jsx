import { useState, useEffect } from 'react';
import algosdk from 'algosdk';
import { useWallet } from '@txnlab/use-wallet-react';
import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils';
import { Buffer } from 'buffer';
import Header from './Header';
import Footer from './Footer';
import tokenImg from '../assets/pixToken.jpg';

window.Buffer = window.Buffer || Buffer;

const algorand = AlgorandClient.fromConfig({
  algodConfig: {
    server: 'https://mainnet-api.voi.nodely.dev',
  },
});

const indexerClient = new algosdk.Indexer('', 'https://mainnet-idx.voi.nodely.dev', '');

function Lottery() {
  const { activeAddress, transactionSigner } = useWallet();
  const [balance, setBalance] = useState(0);
  const [lastWinner, setLastWinner] = useState('');
  const [allowance, setAllowance] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState(null);
  const [lastWonAmount, setLastWonAmount] = useState(0);
  const [uniquePlayerCount, setUniquePlayerCount] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [userEntries, setUserEntries] = useState(0);
  const [winPercentage, setWinPercentage] = useState(0);
  const [winPercentage31, setWinPercentage31] = useState(0);

  const appId = 40093808; // PiX Lottery App ID Mainnet
  const tokenId = 410419; // PiX Token Main Net
  const enterAmount = 1_000_000_000; // 1000 PiX as entry
  const appAddress = 'QDQEZGFXB2INOFX3RVZWSRB54OECI6CUM6E2LQH5LW2BPB3BRINWJSOFL4';
  const managerAddress = 'AM2O6LNEYJKPG7CMU6OIYW36GOFN7GKAH5HPSOSCLS42F7FCDVSMI4PFZY';
  const boxName = new Uint8Array([112, 108, 97, 121, 101, 114, 115]); // b"players"
  const maxEntries = 31; // Expected total entries for display

  const isApproved = allowance !== null && allowance >= BigInt(enterAmount);

  const fetchPlayers = async () => {
    setIsLoadingState(true);
    setError(null);
    try {
      // Fetch box content using Indexer client
      const boxResponse = await indexerClient
        .lookupApplicationBoxByIDandName(appId, boxName)
        .do();
      const boxContent = new Uint8Array(Buffer.from(boxResponse.value, 'base64'));

      // Decode ARC-4 DynamicArray[arc4.Address]
      if (boxContent.length < 2) {
        setUniquePlayerCount(0);
        setTotalEntries(0);
        setUserEntries(0);
        setWinPercentage(0);
        return;
      }

      const length = (boxContent[0] << 8) | boxContent[1]; // 2-byte length
      const addresses = [];
      const expectedSize = 2 + length * 32;

      if (boxContent.length !== expectedSize) {
        throw new Error(
          `Invalid box content: expected ${expectedSize} bytes, got ${boxContent.length}`
        );
      }

      for (let i = 0; i < length; i++) {
        const start = 2 + i * 32;
        const addressBytes = boxContent.slice(start, start + 32);
        const address = algosdk.encodeAddress(addressBytes);
        addresses.push(address);
      }

      // Count unique players and user entries
      const uniqueAddresses = [...new Set(addresses)];
      const total = addresses.length;
      const userEntryCount = activeAddress
        ? addresses.filter((addr) => addr === activeAddress).length
        : 0;

      // Calculate win percentage
      const percentage = total > 0 ? (userEntryCount / total) * 100 : 0;
      const percentageW31 = total > 0 ? (userEntryCount / maxEntries * 100) : 0;

      setUniquePlayerCount(uniqueAddresses.length);
      setTotalEntries(total);
      setUserEntries(userEntryCount);
      setWinPercentage(percentage.toFixed(2));
      setWinPercentage31(percentageW31.toFixed(2))
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to fetch player data. Please try again.');
      setUniquePlayerCount(0);
      setTotalEntries(0);
      setUserEntries(0);
      setWinPercentage(0);
    } finally {
      setIsLoadingState(false);
    }
  };

  const fetchLotteryState = async () => {
    setIsLoadingState(true);
    try {
      const globalState = await algorand.app.getGlobalState(appId);
      const tknBalance = globalState['tkn_balance']?.value;
      if (tknBalance !== undefined) {
        const finalBalance = Number(tknBalance) / 1_000_000;
        setBalance(finalBalance);
      } else {
        console.warn('No tkn_balance found');
      }
      const lastWinningRaw = Number(globalState['last_winning_amount']?.value) / 1_000_000;
      if (lastWinningRaw) {
        const lastWinningAmount = lastWinningRaw;
        setLastWonAmount(lastWinningAmount);
      } else {
        console.log('No last winning amount found');
      }
      const lastWinnerRaw = globalState['last_winner']?.valueRaw;
      if (lastWinnerRaw) {
        const lastWinnerAddress = algosdk.encodeAddress(new Uint8Array(lastWinnerRaw));
        setLastWinner(lastWinnerAddress);
      } else {
        console.log('No last_winner found');
        setLastWinner('None');
      }
    } catch (error) {
      console.error('Fetch lottery state error:', error);
      setError('Failed to update lottery state. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLotteryState();
      await fetchPlayers();
    };
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [activeAddress]);

  useEffect(() => {
    if (activeAddress && transactionSigner) {
      algorand.account.setSigner(activeAddress, transactionSigner);
    }
  }, [activeAddress, transactionSigner]);

  const approveLottery = async () => {
    setIsApproving(true);
    setError(null);
    try {
      const amount = BigInt(10_000_000_000);
      const spender = appAddress;
      const approve = algosdk.ABIMethod.fromSignature('arc200_approve(address,uint256)bool');
      const result = await algorand
        .newGroup()
        .addAppCallMethodCall({
          sender: activeAddress,
          appId: tokenId,
          method: approve,
          args: [spender, amount],
        })
        .send({
          populateAppCallResources: true,
        });
      console.log('Approval result:', result);
      setAllowance(amount);
    } catch (error) {
      console.error('Approval error:', error);
      setError('Failed to approve contract. Check your wallet and try again.');
    }
    setIsApproving(false);
  };

  const checkAllowance = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const owner = activeAddress;
      const spender = appAddress;
      const allowanceMethod = algosdk.ABIMethod.fromSignature('arc200_allowance(address,address)uint256');
      const result = await algorand
        .newGroup()
        .addAppCallMethodCall({
          sender: activeAddress,
          appId: tokenId,
          method: allowanceMethod,
          args: [owner, spender],
        })
        .send({
          populateAppCallResources: true,
        });
      const allowanceValue = result.returns[0].returnValue;
      setAllowance(allowanceValue);
    } catch (error) {
      console.error('Check allowance error:', error);
      setError('Failed to check allowance. Please try again.');
    }
    setIsChecking(false);
  };

  const enterLottery = async () => {
    setIsEntering(true);
    setError(null);
    try {
      const enter = algosdk.ABIMethod.fromSignature('enter(uint64)void');
      const result = await algorand
        .newGroup()
        .addAppCallMethodCall({
          sender: activeAddress,
          appId: appId,
          method: enter,
          args: [enterAmount],
          staticFee: microAlgos(2000),
        })
        .send({
          populateAppCallResources: true,
        });
      console.log('Enter lottery result:', result);
      alert('Successfully entered the lottery!');
      await fetchLotteryState();
      await fetchPlayers();
      setAllowance((prev) => (prev >= BigInt(enterAmount) ? prev - BigInt(enterAmount) : BigInt(0)));
    } catch (error) {
      console.error('Enter lottery error:', error);
      setError('Failed to enter lottery. Ensure you have enough PiX and try again.');
    }
    setIsEntering(false);
  };

  const pickWinner = async () => {
    try {
      const pickWinnerMethod = algosdk.ABIMethod.fromSignature('pick_winner()address');
      const appCall = algorand.newGroup();
      const simulation = await appCall
        .addAppCallMethodCall({
          sender: activeAddress,
          appId: appId,
          method: pickWinnerMethod,
          staticFee: microAlgos(3000),
        })
        .simulate({
          allowUnnamedResources: true,
          allowEmptySignatures: true,
        });

      const unnamedResources = simulation.simulateResponse.txnGroups[0].unnamedResourcesAccessed || {};
      const appsReferenced = (unnamedResources.apps || []).map((app) => app);
      const boxesReferenced = (unnamedResources.boxes || []).map((box) => ({
        appId: Number(box.app),
        name: Buffer.from(box.name).toString('base64'),
      }));

      const result = await appCall
        .addAppCallMethodCall({
          sender: activeAddress,
          appId: appId,
          method: pickWinnerMethod,
          staticFee: microAlgos(5000),
          appReferences: appsReferenced,
          boxReferences: boxesReferenced,
        })
        .send({
          populateAppCallResources: true,
        });
 
      console.log('Pick winner result:', result);
      await fetchLotteryState();
      await fetchPlayers();
    } catch (error) {
      console.error('Pick winner error:', error.message);
      setError('Failed to pick winner. Please try again.');
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  return (
    <div className="main">
      <Header />
      <h1>PiX Lottery</h1>
      <img className="pix-image" src={tokenImg} alt="$PiX Token" />
      <div className="lottery-state">
        {isLoadingState ? (
          <p>Loading lottery state...</p>
        ) : (
          <>
            <h3 className="lottery-state-info">
              Current Prize Balance: {balance} $PiX
            </h3>
            <div className="lottery-winner-container">
              <p className="lottery-state-details">
                Last Round Winner:{' '}
                {lastWinner ? (
                  <span className="winner-address">{truncateAddress(lastWinner)}</span>
                ) : (
                  'None'
                )}{' '}
                <br />
                Last Round Prize: {lastWonAmount} $PiX
              </p>
              <p className="lottery-state-details">
                Unique Players: {uniquePlayerCount} <br />
                Total Entries: {totalEntries} / {maxEntries}
                {activeAddress && (
                  <>
                    <br /> <br />
                    Your Entries: {userEntries} <br />
                    Win chance with current entries: {winPercentage}% <br />
                    Win chance with max entries: {winPercentage31}%
                  </>
                )}
              </p>
            </div>
          </>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="lottery-container">
        {!activeAddress ? (
          <div className="step">
            <p className="step-title">Step 1: Connect Wallet</p>
            <p>Please connect your wallet to participate in the PiX Lottery.</p>
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
        ) : (
          <>
            <div className="step">
              <p className="step-title">Step 1: Approval Check</p>
              {allowance !== null ? (
                <p>
                  Approved up to: {Number(allowance / 1_000_000n).toFixed(2)} PiX{' '}
                  {isApproved ? '✅' : '❌'}
                </p>
              ) : (
                <p>Check if you have approved the lottery contract.</p>
              )}
              <button
                onClick={checkAllowance}
                disabled={isChecking || allowance !== null}
                className={`${isChecking || allowance !== null ? 'disabled' : ''}`}
                aria-label="Check token allowance"
                aria-disabled={isChecking || allowance !== null}
              >
                {isChecking ? 'Checking...' : 'Check Approval'}
              </button>
            </div>
            {allowance !== null && !isApproved && (
              <div className="step">
                <p className="step-title">Step 2: Approve Contract</p>
                <p>Approve the lottery contract to enter lottery.</p>
                <button
                  onClick={approveLottery}
                  disabled={isApproving}
                  className={`action-button ${isApproving ? 'disabled' : ''}`}
                  aria-label="Approve lottery contract"
                  aria-disabled={isApproving}
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </button>
              </div>
            )}
            <div className="step">
              <p className="step-title">Step 3: Enter Lottery</p>
              <p>Enter the lottery for 1,000 PiX.</p>
              <button
                onClick={enterLottery}
                disabled={!isApproved || isEntering}
                className={`${!isApproved || isEntering ? 'disabled' : ''}`}
                aria-label="Enter lottery"
                aria-disabled={!isApproved || isEntering}
                title={!isApproved ? 'Complete previous steps to enable' : ''}
              >
                {isEntering ? 'Entering...' : 'Enter'}
              </button>
            </div>
          </>
        )}
      </div>
      {activeAddress === managerAddress && (
        <div className="manager-section">
          <p>Only the manager of the lottery can see this and pick the winner.</p>
          <button
            onClick={pickWinner}
            disabled={!activeAddress}
            className={`${!activeAddress ? 'disabled' : ''}`}
          >
            Pick Winner
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Lottery;
