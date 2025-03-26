// hooks/useQueryWallets.ts
import { useState, useEffect } from 'react';
import { WalletService } from '@/lib/mockServices';

// Define the response type that matches our mock service
export interface ListWalletResponse {
  chain?: string;
  safeWalletList: Array<{
    id: string;
    chain: string;
    chainId: number;
    txHash: string;
    safeAddress: string;
    guardAddress: string;
    ownerAddress: string;
    aiAddress: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface QueryWalletsOptions {
  chain?: number | string;
  ownerAddress: string;
  enabled?: boolean;
}

export function useQueryWallets({ chain, ownerAddress, enabled = true }: QueryWalletsOptions) {
  const [data, setData] = useState<ListWalletResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWallets = async () => {
    if (!ownerAddress || !enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use our mock service
      const result = await WalletService.walletControllerListWallets({
        ownerAddress,
        chain
      });
      
      setData(result);
    } catch (err) {
      console.error('Error fetching wallets:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch wallets'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch wallets when deps change
  useEffect(() => {
    if (enabled && ownerAddress) {
      fetchWallets();
    }
  }, [ownerAddress, chain, enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchWallets
  };
}