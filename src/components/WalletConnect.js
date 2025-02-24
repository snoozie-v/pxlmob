export const handleWalletConnect = (wallets) => {
    console.log('Wallet connect triggered');
    if (wallets.length > 0) {
      const wallet = wallets[0];
      if (!wallet.isConnected) {
        wallet.connect()
          .then(() => {
            console.log('Successfully connected');
          })
          .catch((error) => {
            console.error('Failed to connect:', error);
          });
      } else {
        wallet.disconnect();
      }
    }
  };