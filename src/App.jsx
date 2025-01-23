import './App.css'
import Pxlmob from './components/Pxlmob';
import NFTDashboard from './components/NFTDashboard';
import {useWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import WalletContext from './components/WalletContext';

console.log(WalletContext)
const walletManager = new WalletManager({
  wallets: [
    WalletId.KIBISIS,
  ],
})

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <WalletProviderComponent />
    </WalletProvider>
  );
}

function WalletProviderComponent() {
  const { activeAddress } = useWallet();

  return (
    <WalletContext.Provider value={{ activeAddress }}>
      <Pxlmob />
      {/* <NFTDashboard /> */}
    </WalletContext.Provider>
  );
}

export default App;