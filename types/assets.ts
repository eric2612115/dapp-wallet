// types/assets.ts

export interface Asset {
    id: string;
    name: string;
    symbol: string;
    balance: number;
    price: number;
    value: number;
    change24h: number;
    logoUrl?: string;
    // Additional fields
    chain?: string;
    chainIndex?: number | string;
    tokenAddress?: string;    // Token contract address needed for ERC20 transfers
    decimals?: number;        // Token decimals needed for ERC20 transfers (defaults to 18)
    isWhitelisted?: boolean;  // For multi-signature wallet assets
  }
  
  export interface TokenInfo {
    symbol: string;
    name: string;
    balance: number;
    value: number;
    tokenAddress?: string;
    decimals?: number;
    chain: string;
    chainId: number;
  }
  
  export interface MultisigWallet {
    name: string;
    multisig_address: string;
    chain: string;
    chainId: number;
  }
  
  export interface ApiAsset {
    symbol: string;
    balance: string;
    tokenPrice: string;
    value: string;
    chain: string;
    chainIndex: number | string;
    tokenAddress: string;
    decimals: number;
    icon?: string;
  }