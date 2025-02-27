import Header from "./Header";
import Footer from "./Footer";
import RandomNFTDisplay from "./RandomNFTDisplay";


const RoadMap = () => {
  return (
    <>
    <Header />
    <div className="roadmap"
    style={{ 
      maxWidth: "700px", 
      margin: "0 auto", // Center the container
      padding: "0 20px" // Optional: Add some padding if needed
    }}>
      <h1>Roadmap</h1>
    <RandomNFTDisplay />
      <section className="phase-one">
        <h2>More info coming soon</h2>
        {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <ul>
          <li>Initial Concept Development</li>
          <li>Team Assembly</li>
          <li>Technology Stack Selection</li>
        </ul> */}
      </section>
    </div>
    <Footer />
    </>
  );
};

export default RoadMap;