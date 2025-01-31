import './App.css';
import Pxlmob from './components/Pxlmob';
import Token from './components/Token';
// import NFTDashboard from './components/NFTDashboard';
import { useWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react';
import WalletContext from './components/WalletContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu'; // Import your NavigationMenu component
import RoadMap from './components/Roadmap';


const walletManager = new WalletManager({
  wallets: [
    WalletId.KIBISIS,
  ],
});

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <Router>
        <WalletProviderComponent />
      </Router>
    </WalletProvider>
  );
}

function WalletProviderComponent() {
  const { activeAddress } = useWallet();

  return (
    <WalletContext.Provider value={{ activeAddress }}>
      <div>


        {/* Routes */}
        <Routes>
          <Route path="/" element={<Pxlmob />} />
          <Route path="/token" element={<Token />} /> {/* Placeholder for Token page */}
          <Route path="/roadmap" element={<RoadMap/>} /> {/* Placeholder for Roadmap page */}
          <Route path="/navigation-menu" element={<NavigationMenu />} />
          {/* <Route path="/nft-dashboard" element={<NFTDashboard />} /> */}
        </Routes>
      </div>
    </WalletContext.Provider>
  );
}

export default App;