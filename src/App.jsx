import './App.css';
import Pxlmob from './components/Pxlmob';
import Token from './components/Token';
import Lottery from './components/Lottery';
// import NFTDashboard from './components/NFTDashboard';
import { WalletProvider, WalletId, WalletManager, NetworkConfigBuilder, useWallet } from '@txnlab/use-wallet-react';
import WalletContext from './components/WalletContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu'; 
// import RoadMap from './components/Roadmap';

const networks = new NetworkConfigBuilder()
  .addNetwork('voi-mainnet', {
    algod: {
      token: '',
      baseServer: 'https://mainnet-api.voi.nodely.dev',
      port: '',
    },
    isTestnet: false,
    genesisHash: 'r20fSQI8gWe/kFZziNonSPCXLwcQmH/nxROvnnueWOk=',
    genesisId: 'voimain-v1.0',
  })
  .addNetwork('voi-testnet', {
    algod: {
      token: '',
      baseServer: 'https://testnet-api.voi.nodely.dev',
      port: '',
    },
    isTestnet: true,
    genesisHash: 'mufvzhECYAe3WaU075v0z4k1/SNUIuUPCyBTE+Z/08s==',
    genesisId: 'voitest-v1.1',
  })
  .build();

const walletManager = new WalletManager({
  wallets: [
    WalletId.KIBISIS,
    {
      id: WalletId.LUTE,
      options: {
        siteName: 'PiX Lottery',
      },
    },
  ],
  networks,
  defaultNetwork: 'voi-mainnet',
});
walletManager.setActiveNetwork('voi-mainnet');

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
          {/* <Route path="/roadmap" element={<RoadMap/>} /> Placeholder for Roadmap page */}
          <Route path="/navigation-menu" element={<NavigationMenu />} />
          <Route path="/lottery" element={<Lottery />} />
        </Routes>
      </div>
    </WalletContext.Provider>
  );
}

export default App;
