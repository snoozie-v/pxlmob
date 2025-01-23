import RandomNFTDisplay from './RandomNFTDisplay';
import Header from './Header';
import NFTLookupTwo from './NFTLookupTwo';

const Pxlmob = () => {
    return (
        <div>
            <Header />
            <h2>Make Pixels Great Again.</h2>
            <RandomNFTDisplay />
            <NFTLookupTwo />
            {/* <h4>999 PXL Minotaurs forged on the VOI Network.</h4> */}
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