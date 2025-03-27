// types/transactions.ts

export interface Transaction {
    hash: string;
    type: 'Swap' | 'Send' | 'Receive';
    from: string;
    to: string;
    amount: string;
    value: string;
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
    chain?: string;
    details?: Record<string, unknown>;
    chainIndex?: string | number;
  }