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
        <h2>Phase 1: Inception</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <ul>
          <li>Initial Concept Development</li>
          <li>Team Assembly</li>
          <li>Technology Stack Selection</li>
        </ul>
      </section>

      <section className="phase-two">
        <h2>Phase 2: Development</h2>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <ul>
          <li>Prototype Launch</li>
          <li>Alpha Testing</li>
          <li>Core Feature Implementation</li>
        </ul>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default RoadMap;