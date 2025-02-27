import Header from './Header';
import Footer from './Footer';
import tokenImg from '../assets/pixToken.jpg';
import TokenBalance from './TokenBalance';


const Token = () => {
  return (
    <>
      <Header />
      <div className="token-container">
        <h1 className="token-title">$PIX Token Information</h1>
        
        <a href="https://voi.nomadex.app/0/0/2/410419" className="buy-link">
          <h2>Buy $PIX on Nomadex</h2>
        </a>
        <img className="pix-image" src={tokenImg} alt="$PIX Token" />
        <TokenBalance />

        <section className="dates">
          <h2 className="section-title">More Info Coming soon</h2>
          {/* <ul className="dates-list">
            <li>Launch Date: <span>Eiusmod tempor incididunt</span></li>
            <li>First Distribution: <span>Ut labore et dolore magna aliqua</span></li>
            <li>Next Airdrop: <span>Ut enim ad minim veniam</span></li>
          </ul> */}
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Token;