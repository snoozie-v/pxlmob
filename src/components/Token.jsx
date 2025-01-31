import Header from './Header';
import Footer from './Footer';

const Token = () => {
  return (
    <>
    <Header />
    <div style={{ 
      maxWidth: "700px", 
      margin: "0 auto", // Center the container
      padding: "0 20px" // Optional: Add some padding if needed
    }}>
      
      <h1 style={{ textAlign: "center" }}>Token Information</h1>

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

      <section className="distribution">
        <h2>Token Distribution</h2>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      </section>

      <section className="utility">
        <h2>Token Utility</h2>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
      </section>
      
    </div>
    <Footer />
    </>
  );
};

export default Token;