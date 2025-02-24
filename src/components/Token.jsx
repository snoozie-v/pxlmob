import Header from './Header';
import Footer from './Footer';
import tokenImg from '../assets/pixToken.jpg'
import TokenBalance from './TokenBalance';

const Token = () => {
  return (
    <>
    <Header />
    <div style={{ 
      maxWidth: "700px", 
      margin: "0 auto", // Center the container
      padding: "0 20px" // Optional: Add some padding if needed
    }}>
      
      <h1 style={{ textAlign: "center" }}>$PIX Token Information</h1>
      
      <a href="https://voi.nomadex.app/0/0/2/410419">
      <h2>Buy $PIX here</h2><img className="pix-image" src={tokenImg} /></a>
      <TokenBalance />

      <section className="dates">
        <h2 style={{ textAlign: "center" }}>Important Dates</h2>
        <ul style={{ textAlign: "left", listStylePosition: "inside" }}>
          <li>Launch Date: <span>Eiusmod tempor incididunt</span></li>
          <li>First Distribution: <span>Ut labore et dolore magna aliqua</span></li>
          <li>Next Airdrop: <span>Ut enim ad minim veniam</span></li>
        </ul>
      </section>

      <section className="supply">
        <h2 style={{ textAlign: "center" }}>Token Supply</h2>
        <p>{/* Center the paragraph text if needed */}</p>
        <ul style={{ textAlign: "left", listStylePosition: "inside" }}>
          <li>Total Supply: <span>Excepteur sint occaecat cupidatat non proident</span></li>
          <li>Circulating Supply: <span>Sunt in culpa qui officia deserunt mollit anim id est laborum</span></li>
        </ul>
      </section>

      
    </div>
    <Footer />
    </>
  );
};

export default Token;