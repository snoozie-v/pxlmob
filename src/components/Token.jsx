import Header from './Header';
import Footer from './Footer';
import tokenImg from '../assets/pixToken.jpg';
import TokenBalance from './TokenBalance.tsx';
import TokenOwners from './TokenOwners'
import allocation from '../assets/allocation.png'

const Token = () => {
  return (
    <>
      <Header />
      <div className="token-container">
        <h1 className="token-title">$PiX Token Information</h1>
        <img className="pix-image" src={tokenImg} alt="$PiX Token" />
        <TokenBalance />
        <h2>Welcome to $PiX Token, more than just a meme coin!</h2>
        <h3>$PiX is our community reward token and will be the currency for the PXLMOB Arcade.</h3>
        <h3>Each PXLMOB NFT you hold earns you daily $PiX via a token drip mechanism.</h3>
        <h3>We plan to use $PiX token as an onboarding tool for new users into the VOI ecosytem.</h3>
        <h2>So have fun, and remember to #SendPiX</h2>
        <hr/>
        <h2>Launch Date - 28/02/2025</h2>
        <h2>Total Supply - 100,000,000 $PiX Token</h2>
        <h3>Token Allocation:</h3>
        <ul className="allocation-list">
          <li><span className="percentage">5%</span> Voi Fountain</li>
          <li><span className="percentage">5%</span> PXLMOB Team wallet --locked for 1 year</li>
          <li><span className="percentage">10%</span> Initial LP</li>
          <li><span className="percentage">10%</span> Token Drops / Giveaways and Prizes</li>
          <li><span className="percentage">10%</span> PXLMOB SZN ONE - Daily Drip Staking</li>
          <li><span className="percentage">10%</span> LP Partners</li>
          <li><span className="percentage">10%</span> DeFi Rewards</li>
          <li><span className="percentage">40%</span> CODE NAME - SUMMER TBA</li>
        </ul>
        <img className='allocation-img'src={allocation}></img>
        <h3>Each PXLMOB SZN ONE NFT receives 10 $PiX token daily drip for 3 years!</h3>
        <TokenOwners />
      </div>
      <Footer />
    </>
  );
};

export default Token;
