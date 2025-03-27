// hooks/useAssets.ts
import { useState, useCallback, useMemo } from 'react';
import type { Asset, ApiAsset } from '@/types/assets';

interface UseAssetsOptions {
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useAssets(
  walletAddress: string, 
  search: string, 
  walletType: 'personal' | 'multisig',
  options: UseAssetsOptions = {}
) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [sortColumn, setSortColumn] = useState(options.sortColumn || 'value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(options.sortDirection || 'desc');
  
  const fetchAssets = useCallback(async () => {
    if (!walletAddress) return;
    
    setLoadingAssets(true);
    try {
      // Use API endpoint
      const response = await fetch('/api/total-balance-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert API data to Asset format
      const formattedAssets: Asset[] = data.map((item: ApiAsset, index: number) => ({
        id: index.toString(),
        name: item.symbol,
        symbol: item.symbol,
        balance: parseFloat(item.balance) || 0,
        price: parseFloat(item.tokenPrice) || 0,
        value: parseFloat(item.value) || 0,
        change24h: 0, // API doesn't provide 24h change, default to 0
        chain: item.chain,
        chainIndex: item.chainIndex?.toString(), // Convert to string to fix type issues
        tokenAddress: item.tokenAddress,
        decimals: item.decimals,
        logoUrl: item.icon || undefined,
        isWhitelisted: walletType === 'multisig' ? Math.random() > 0.3 : undefined,
      }));
      
      setAssets(formattedAssets);
    } catch (error) {
      console.error(`Error fetching ${walletType} assets:`, error);
      setAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  }, [walletAddress, walletType]);
  
  // Handle sorting
  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // Default to descending
    }
  }, [sortColumn, sortDirection]);
  
  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    // First filter
    const filtered = assets.filter(
      asset => 
        asset.name.toLowerCase().includes(search.toLowerCase()) || 
        asset.symbol.toLowerCase().includes(search.toLowerCase())
    );
    
    // Then sort
    return [...filtered].sort((a, b) => {
      const aValue = a[sortColumn as keyof Asset];
      const bValue = b[sortColumn as keyof Asset];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      const aNum = Number(aValue) || 0;
      const bNum = Number(bValue) || 0;
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });
  }, [assets, search, sortColumn, sortDirection]);
  
  return {
    assets,
    loadingAssets,
    fetchAssets,
    sortColumn,
    sortDirection,
    setSortColumn,
    setSortDirection,
    handleSort,
    filteredAssets,
  };
}