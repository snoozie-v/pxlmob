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

function Lottery() {
  const { activeAddress, transactionSigner, } = useWallet();
  const [balance, setBalance] = useState(0);
  const [players, setPlayers] = useState([]);
  const [lastWinner, setLastWinner] = useState('');
  const [allowance, setAllowance] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState(null);
  const [lastWonAmount, setLastWonAmount] = useState(0);

  const appId = 40093808; // PiX Lottery App ID Mainnet
  const tokenId = 410419; // PiX Token Main Net
  const enterAmount = 1_000_000_000; // 1000 PiX as entry
  const appAddress = 'QDQEZGFXB2INOFX3RVZWSRB54OECI6CUM6E2LQH5LW2BPB3BRINWJSOFL4';
  const managerAddress = 'AM2O6LNEYJKPG7CMU6OIYW36GOFN7GKAH5HPSOSCLS42F7FCDVSMI4PFZY';

  const isApproved = allowance !== null && allowance >= BigInt(enterAmount);
  // Auto-update balance and last winner
  const fetchLotteryState = async () => {
    setIsLoadingState(true);
    try {
      // Fetch token balance
      const globalState = await algorand.app.getGlobalState(appId);
      const tknBalance = globalState['tkn_balance']?.value;
      if (tknBalance !== undefined) {
        const finalBalance = Number(tknBalance) / 1_000_000;
        const playersBalance = Number(finalBalance) / 1_000
        setBalance(finalBalance);
        setPlayers(playersBalance);
      } else {
        console.warn('No tkn_balance found');
      }
      // Fetch last amount sent to winner
      const lastWinningRaw = Number(globalState['last_winning_amount']?.value) / 1000000
      if (lastWinningRaw) {
        const lastWinningAmount = (lastWinningRaw)
        setLastWonAmount(lastWinningAmount)
      } else {
        console.log('No last winning amount found');
      }
      // Fetch last winner
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
    setIsLoadingState(false);
  };

  useEffect(() => {
    fetchLotteryState(); 
    const interval = setInterval(fetchLotteryState, 30_000); 
    return () => clearInterval(interval); 
  }, []);

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
      // console.log('Allowance:', allowanceValue);
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
      // Locally update allowance (assuming contract deducts enterAmount)
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
      const appsReferenced = (unnamedResources.apps || []).map(app => (app));
      const boxesReferenced = (unnamedResources.boxes || []).map(box => ({
        appId: Number(box.app),
        name: Buffer.from(box.name).toString('base64'),
      }));

      const result = await appCall
        .addAppCallMethodCall({
          sender: activeAddress,
          appId: appId,
          method: pickWinnerMethod,
          staticFee: microAlgos(2000),
          appReferences: appsReferenced,
          boxReferences: boxesReferenced,
        })
        .send({
          populateAppCallResources: true,
        });

      console.log('Pick winner result:', result);
      await fetchLotteryState();

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
            {/* Lottery State Section */}
            <div className="lottery-state">
            {isLoadingState ? (
                <p>Loading lottery state...</p>
            ) : (
                <>
                    <h3 className="lottery-state-info">
                    Current Prize Balance: {balance} $PiX  ||  Number of Players: {players} / 31
                    </h3>
                <div className="lottery-winner-container">
                    <p className="lottery-state-details">
                    Last Round Winner:{' '}
                    {lastWinner ? (
                        <>
                        <span className="winner-address">{truncateAddress(lastWinner)}</span>
                        </>
                    ) : (
                        'None'
                    )}{' '}
                    <br/>Last Round Prize: {lastWonAmount} $PiX
                    </p>
                </div>
                </>
            )}
            </div>

            {/* Lottery Interaction Section */}
            <div className="lottery-container">
            {!activeAddress ? (
                <div className="step">
                  <p className="step-title">Step 1: Connect Wallet</p>
                  <p>Please connect your wallet to participate in the PiX Lottery.</p>
                  <button
                    id = "connect"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
                      document.getElementById('walletImage')?.click(); // Trigger wallet image click
                    }}
                    // className="action-button"
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
                    <p>Enter the lottery for 1,000 PiX .</p>
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

                {error && <p className="error-message">{error}</p>}
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
