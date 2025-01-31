import Header from "./Header";
import Footer from "./Footer";


const RoadMap = () => {
  return (
    <>
    <div className="roadmap"
    style={{ 
      maxWidth: "700px", 
      margin: "0 auto", // Center the container
      padding: "0 20px" // Optional: Add some padding if needed
    }}>
    
    <Header />
      <h1>Roadmap</h1>

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

      <section className="phase-three">
        <h2>Phase 3: Expansion</h2>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <ul>
          <li>Market Expansion</li>
          <li>Partnerships Establishment</li>
          <li>Feature Enhancement</li>
        </ul>
      </section>

      <section className="phase-four">
        <h2>Phase 4: Stabilization</h2>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
        <ul>
          <li>Scalability Improvements</li>
          <li>Security Audits</li>
          <li>User Experience Refinement</li>
        </ul>
      </section>

      <section className="phase-five">
        <h2>Phase 5: Innovation</h2>
        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
        <ul>
          <li>Research & Development</li>
          <li>New Product Lines</li>
          <li>Community Building Initiatives</li>
        </ul>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default RoadMap;