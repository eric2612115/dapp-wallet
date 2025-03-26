// utils/explorerUtils.ts

// Map of blockchain explorers by chain ID
export const BLOCKCHAIN_EXPLORERS: Record<string, string | Record<string, string>> = {
    // Mainnets
    '1': 'https://etherscan.io/address/', // Ethereum
    '56': 'https://bscscan.com/address/', // BNB Smart Chain
    '137': 'https://polygonscan.com/address/', // Polygon
    '42161': 'https://arbiscan.io/address/', // Arbitrum
    '10': 'https://optimistic.etherscan.io/address/', // Optimism
    '8453': 'https://basescan.org/address/', // Base
    '43114': 'https://snowtrace.io/address/', // Avalanche
    '250': 'https://ftmscan.com/address/', // Fantom
    '42220': 'https://celoscan.io/address/', // Celo
    
    // Map for TX lookup
    tx: {
      '1': 'https://etherscan.io/tx/', // Ethereum
      '56': 'https://bscscan.com/tx/', // BNB Smart Chain
      '137': 'https://polygonscan.com/tx/', // Polygon
      '42161': 'https://arbiscan.io/tx/', // Arbitrum
      '10': 'https://optimistic.etherscan.io/tx/', // Optimism
      '8453': 'https://basescan.org/tx/', // Base
    }
  };
  
  /**
   * Get explorer URL for a wallet address based on chain ID
   * @param address The wallet address to view
   * @param chainId The chain ID (defaults to Ethereum mainnet)
   * @returns The full explorer URL
   */
  export const getExplorerUrl = (address: string, chainId: number | string = '1'): string => {
    const chainIdStr = chainId.toString();
    const baseUrl = BLOCKCHAIN_EXPLORERS[chainIdStr] || BLOCKCHAIN_EXPLORERS['1']; // Default to Ethereum
    return `${baseUrl}${address}`;
  };
  
  /**
   * Open blockchain explorer in a new window
   * @param address The wallet address to view
   * @param chainId The chain ID (defaults to Ethereum mainnet)
   */
  export const openExplorer = (address: string, chainId: number | string = '1'): void => {
    if (address) {
      window.open(getExplorerUrl(address, chainId), '_blank', 'noopener,noreferrer');
    }
  };
  
  /**
   * Get explorer URL for a transaction hash
   * @param txHash The transaction hash
   * @param chainId The chain ID (defaults to Ethereum mainnet)
   * @returns The full explorer URL for the transaction
   */
  export const getTxExplorerUrl = (txHash: string, chainId: number | string = '1'): string => {
    const chainIdStr = chainId.toString();
    const txExplorers = BLOCKCHAIN_EXPLORERS.tx as Record<string, string>;
    const baseUrl = txExplorers[chainIdStr] || txExplorers['1']; // Default to Ethereum
    return `${baseUrl}${txHash}`;
  };