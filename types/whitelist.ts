// types/whitelist.ts

// Token type definition
export interface Token {
    symbol: string;
    name: string;
    address: string;
    whitelisted: boolean;
    type: 'token' | 'protocol' | 'contract' | 'function';
    parent?: string; // For nested items
  }
  
  // Protocol type definition
  export interface Protocol {
    name: string;
    description: string;
    icon?: string;
    tokens: Token[];
    contracts: Contract[];
    expanded?: boolean; // UI state for accordion
  }
  
  // Contract type
  export interface Contract {
    name: string;
    address: string;
    description?: string;
    functions: Function[];
    expanded?: boolean; // UI state for accordion
  }
  
  // Function type
  export interface Function {
    name: string;
    signature: string;
    description?: string;
    whitelisted: boolean;
  }
  
  // Verified token type
  export interface VerifiedToken {
    symbol: string;
    name: string;
    address: string;
    decimals?: number;
  }