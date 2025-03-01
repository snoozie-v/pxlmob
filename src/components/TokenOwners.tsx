import React, { useState, useEffect } from "react";

// Define props interface for TypeScript
interface TokenOwnersProps {
  contractId: number;
}

const TokenOwners: React.FC<TokenOwnersProps> = ({ contractId = 410419}) => {
  const [pixOwners, setPixOwners] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch number of owners
  async function getNumberOfOwners(contractId: number) {
    try {
      const response = await fetch(
        `https://mainnet-idx.nautilus.sh/nft-indexer/v1/arc200/balances?contractId=${contractId}`
      );
      const data = await response.json();
      console.log('data', data)
      if (!data || !Array.isArray(data.balances)) {
        throw new Error("Invalid response format or no balances found");
      }
      const owners = data.balances.length
      console.log('owners', owners)
      setPixOwners(owners);
    } catch (error: any) {
      console.error("Error fetching number of owners:", error.message);
      setError(error.message);
      setPixOwners(null);
    } finally {
      setLoading(false);
    }
  }
  // Fetch data when the component mounts or contractId changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    getNumberOfOwners(contractId);
  }, [contractId]);
  // Render the component
  return (
    <div className="pix-owners">
      <h3>
        Total PiX Owners:{" "}
        {loading ? "Loading..." : error ? "Error" : pixOwners || "0"}
      </h3>
    </div>
  );
};

export default TokenOwners;