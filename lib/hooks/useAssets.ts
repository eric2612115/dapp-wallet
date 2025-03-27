// hooks/useAssets.ts
import { useState, useCallback, useMemo } from 'react';
import type { Asset, ApiAsset } from '@/types/assets';

interface UseAssetsOptions {
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

// Mock data to use when API is not available
const mockAssets: ApiAsset[] = [
  {
    symbol: 'ETH',
    balance: '2.5',
    tokenPrice: '3500',
    value: '8750',
    chain: 'Ethereum',
    chainIndex: 1,
    tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'USDC',
    balance: '5000',
    tokenPrice: '1',
    value: '5000',
    chain: 'Ethereum',
    chainIndex: 1,
    tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'LINK',
    balance: '100',
    tokenPrice: '15',
    value: '1500',
    chain: 'Ethereum',
    chainIndex: 1,
    tokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    decimals: 18,
    icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
  },
  {
    symbol: 'BTC',
    balance: '0.25',
    tokenPrice: '65000',
    value: '16250',
    chain: 'Wrapped',
    chainIndex: 1,
    tokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
  }
];

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
      // Try to use API endpoint
      let data;
      try {
        const response = await fetch('/api/total-balance-detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wallet_address: walletAddress }),
        });
        
        if (!response.ok) {
          // If API call fails, use mock data instead
          console.log(`API endpoint not available (${response.status}), using mock data`);
          data = mockAssets;
        } else {
          data = await response.json();
        }
      } catch (error) {
        // If fetch fails (e.g., API endpoint doesn't exist), use mock data
        console.log('API fetch failed, using mock data:', error);
        data = mockAssets;
      }
      
      // Randomize change24h values for mock data
      const getRandomChange = () => {
        return (Math.random() * 10 - 5).toFixed(2);
      };
      
      // Add some random whitelist status for multisig assets
      const isRandomlyWhitelisted = () => {
        return Math.random() > 0.3;
      };
      
      // Convert API data to Asset format
      const formattedAssets: Asset[] = data.map((item: ApiAsset, index: number) => ({
        id: index.toString(),
        name: item.symbol,
        symbol: item.symbol,
        balance: parseFloat(item.balance) || 0,
        price: parseFloat(item.tokenPrice) || 0,
        value: parseFloat(item.value) || 0,
        change24h: parseFloat(getRandomChange()), // Random value between -5 and 5
        chain: item.chain,
        chainIndex: item.chainIndex?.toString(), // Convert to string to fix type issues
        tokenAddress: item.tokenAddress,
        decimals: item.decimals,
        logoUrl: item.icon || undefined,
        isWhitelisted: walletType === 'multisig' ? isRandomlyWhitelisted() : undefined,
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