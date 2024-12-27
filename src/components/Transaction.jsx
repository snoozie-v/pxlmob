// import { useState, useEffect } from 'react';

// import algosdk from 'algosdk';
// import CONFIG from '../config/index.js';


// // Voi configuration
// const VOIClient = new algosdk.Algodv2('', CONFIG.APIS.VOI_NODE, '');

// function Transaction() {
//   const [transaction, setTransaction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchTransaction() {
//       try {
//         setLoading(true);
//         const transactionHash = 'IK5WO3VAV34MBCXOZ3H2TH66E4E36GWCIOWT2W5EPJGYWUZCRAMA';
//         const tx = await VOIClient.getTransactionByHash(transactionHash).do();
//         console.log('tx', tx)
//         setTransaction(tx);
//         setLoading(false);
//       } catch (err) {
//         console.error('Failed to fetch transaction:', err);
//         setError('Failed to fetch transaction details');
//         setLoading(false);
//       }
//     }
//     fetchTransaction();
//   }, []);

//   if (loading) return <p>Loading transaction data...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <>
//       <h2>Transaction Details</h2>
//       {transaction ? (
//         <div>
//           <p>Transaction Hash: {transaction.tx}</p>
//           <p>From: {transaction.sender}</p>
//           <p>To: {transaction.tx-type === 'pay' ? transaction.paymentTxn.receiver : 'N/A'}</p>
//           <p>Amount: {transaction.tx-type === 'pay' ? transaction.paymentTxn.amount / 1e6 : 'N/A'} Voi</p>
//           {/* Add more transaction details as needed */}
//         </div>
//       ) : (
//         <p>No transaction data available</p>
//       )}
//     </>
//   );
// }

// export default Transaction;