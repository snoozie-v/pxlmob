import RandomNFTDisplay from './RandomNFTDisplay';
import Header from './Header';
import NFTLookupTwo from './NFTLookupTwo';
import Footer from './Footer';

const Pxlmob = () => {
    return (
        <div>
            <Header />
            <h1>Make Pixels Great Again.</h1>
            <RandomNFTDisplay />
            <p>999 PXL Minotaurs forged on the VOi Network.</p> 
            <h3>They may be cute but these little Minos pack a punch!!</h3>
            <NFTLookupTwo />
            {/* <h4>999 PXL Minotaurs forged on the VOI Network.</h4> */}
            <Footer />
        </div>
    )
}

export default Pxlmob

// const NFTDashboard = () => {
//     const [selectedAddress, setSelectedAddress] = useState('');
  
//     return (
//       <div>
//         <NFTLookup target={selectedAddress} />
//         <NFTHolderStats setSelectedAddress={setSelectedAddress} />
  
//       </div>
//     );
//   };
  
//   export default NFTDashboard;