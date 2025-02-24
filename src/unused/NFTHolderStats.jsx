import React, { useState, useEffect } from 'react';

const NFTHolderStats = ({ setSelectedAddress }) => {
  const [holders, setHolders] = useState([]);
  const [totalHolders, setTotalHolders] = useState(0);
  const [totalPieces, setTotalPieces] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // contract ID for PXLMOB
        const [response1, response2] = await Promise.all([
          fetch('https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens?contractId=447482'),
          fetch('https://arc72-voi-mainnet.nftnavigator.xyz/nft-indexer/v1/tokens?contractId=400099')
        ]);

        const [data1, data2] = await Promise.all([response1.json(), response2.json()]);

        // Combine tokens from both responses
        const allTokens = [...data1.tokens, ...data2.tokens];

        const countHolders = {};
        let pieceCount = 0;
        allTokens.forEach(token => {
          countHolders[token.owner] = (countHolders[token.owner] || 0) + 1;
          pieceCount++;
        });

        const sortedHolders = Object.entries(countHolders)
          .sort((a, b) => b[1] - a[1]);

        setHolders(sortedHolders);
        setTotalHolders(Object.keys(countHolders).length);
        setTotalPieces(pieceCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (address) => {
    setSelectedAddress(address);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = holders.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(holders.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <p>Total Number of Holders: {totalHolders}</p>
      <p>Total Number of Pieces: {totalPieces}</p>

      <table>
        <thead>
          <tr>
            <th>Holder Address</th>
            <th>Number of NFTs Held</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map(([address, count], index) => (
            <tr key={index}>
              <td>
                <a 
                  href={`#`} 
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleClick(address);
                  }}
                >
                  {address}
                </a>
              </td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {pageNumbers.map(number => (
          <button 
            key={number} 
            onClick={() => paginate(number)}
            style={currentPage === number ? { backgroundColor: 'lightgray' } : {}}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NFTHolderStats;