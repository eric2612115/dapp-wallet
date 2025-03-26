// app/portfolio/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Alert, AlertTitle, alpha, Box, Button, CircularProgress,
  IconButton, InputAdornment, Tab, Tabs, TextField, Typography, useTheme 
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useAccount, useChainId } from 'wagmi';
import AssetTable from '@/components/portfolio/AssetTable';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import WalletOverview from '@/components/portfolio/WalletOverview';
import QuickTransferCard from '@/components/portfolio/QuickTransferCard';
import DepositDialog from '@/components/portfolio/DepositDialog';
import type { Asset } from '@/components/portfolio/AssetTable';
import type { Transaction } from '@/components/portfolio/TransactionHistory';
import { useQueryWallets } from '@/lib/hooks/useQueryWallets';
import { useWithdrawFromSafe } from '@/lib/hooks/useWithdrawFromSafe';
import usePageView from '@/lib/hooks/usePageView';
import { AssetService, WalletService } from '@/lib/mockServices'; // Update to the correct path

// API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';

// Multisig wallet interface
interface MultisigWallet {
  name: string;
  multisig_address: string;
  chain: string;
  chainId: number;
}

export default function PortfolioPage() {
  const theme = useTheme();
  // add usePageView hook
  usePageView();
  const { isConnected, address } = useAccount();
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState('value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedMultisigWalletAddress, setSelectedMultisigWalletAddress] = useState<string>('');

  // Wallet type
  const walletType = tabValue === 0 ? 'personal' : 'multisig';

  // Data states
  const [personalAssets, setPersonalAssets] = useState<Asset[]>([]);
  const [multisigAssets, setMultisigAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [relatedMultisigWallets, setRelatedMultisigWallets] = useState<MultisigWallet[]>([]);
  
  // Loading states
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [, setLoadingRelatedWallets] = useState(false);
  const chainId = useChainId();

  // Fetch multi-signature wallets using the hook
  const { 
    data: walletsData,
    isLoading: isLoadingWallets,
    error: walletsError,
    refetch: refetchWallets
  } = useQueryWallets({
    chain: chainId,
    ownerAddress: address || '',
    enabled: mounted && isConnected && Boolean(address)
  });
  
  // Current assets based on selected wallet type
  const currentAssets = walletType === 'personal' ? personalAssets : multisigAssets;

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Process wallets data when it's available
  useEffect(() => {
    if (walletsData?.safeWalletList && walletsData.safeWalletList.length > 0) {
    interface WalletData {
      safeAddress: string;
      chain?: string;
      chainId?: number;
    }

    const formattedWallets: MultisigWallet[] = walletsData.safeWalletList.map((wallet: WalletData, idx: number) => ({
      name: `Multi-Sig Wallet-${idx + 1}`,
      multisig_address: wallet.safeAddress,
      chain: wallet.chain || 'Ethereum',
      chainId: wallet.chainId ?? (wallet.chain ? parseInt(wallet.chain) : chainId || 1),
    }));
      setRelatedMultisigWallets(formattedWallets);
      
      // Set the first multisig wallet as selected if none is selected
      if (formattedWallets.length > 0 && !selectedMultisigWalletAddress) {
        setSelectedMultisigWalletAddress(formattedWallets[0].multisig_address);
      }
    } else {
      setRelatedMultisigWallets([]);
    }
  }, [walletsData, selectedMultisigWalletAddress, chainId]);

  // Fetch assets when wallet connected or tab changes
  useEffect(() => {
    if (mounted && isConnected && address) {
      if (walletType === 'personal') {
        fetchPersonalAssets();
        fetchTransactions(address);
      } else if (selectedMultisigWalletAddress) {
        fetchMultisigAssets();
        fetchTransactions(selectedMultisigWalletAddress);
      }
    }
  }, [mounted, isConnected, address, walletType, selectedMultisigWalletAddress]);

  // Fetch personal wallet assets
  const fetchPersonalAssets = async () => {
    if (!address) return;
    
    setLoadingAssets(true);
    try {
      // Use total-balance-detail API
      const response = await fetch('/api/total-balance-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert API data to Asset format
      interface ApiAsset {
        symbol: string;
        balance: string;
        tokenPrice: string;
        value: string;
        chain: string;
        chainIndex: number;
        tokenAddress: string;
        decimals: number;
        icon?: string;
      }

      const formattedAssets: Asset[] = data.map((item: ApiAsset, index: number) => ({
        id: index.toString(),
        name: item.symbol, // Use symbol as name since API doesn't provide name
        symbol: item.symbol,
        balance: parseFloat(item.balance) || 0,
        price: parseFloat(item.tokenPrice) || 0,
        value: parseFloat(item.value) || 0,
        change24h: 0, // API doesn't provide 24h change, default to 0
        chain: item.chain,
        chainIndex: item.chainIndex,
        tokenAddress: item.tokenAddress,
        decimals: item.decimals,
        logoUrl: item.icon || undefined,
      }));
      
      setPersonalAssets(formattedAssets);
      
      // Calculate total balance
      const total = formattedAssets.reduce((sum, asset) => sum + asset.value, 0);
      setTotalBalance(total);
    } catch (error) {
      console.error('Error fetching personal assets:', error);
      // Use mock data as fallback
      setPersonalAssets([
        { 
          id: '1', 
          name: 'Ethereum', 
          symbol: 'ETH', 
          balance: 2.5, 
          price: 3500, 
          value: 8750, 
          change24h: 1.2, 
          chain: 'Ethereum',
          tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH contract
          decimals: 18
        },
        { 
          id: '2', 
          name: 'USD Coin', 
          symbol: 'USDC', 
          balance: 5000, 
          price: 1, 
          value: 5000, 
          change24h: 0, 
          chain: 'Ethereum',
          tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC contract
          decimals: 6
        },
        { 
          id: '3', 
          name: 'ChainLink', 
          symbol: 'LINK', 
          balance: 100, 
          price: 15, 
          value: 1500, 
          change24h: -0.5, 
          chain: 'Ethereum',
          tokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK contract
          decimals: 18
        }
      ]);
      
      if (walletType === 'personal') {
        setTotalBalance(15250); // Mock total balance
      }
    } finally {
      setLoadingAssets(false);
    }
  };

  // Fetch multisig wallet assets
  const fetchMultisigAssets = async () => {
    if (!selectedMultisigWalletAddress) return;
    
    setLoadingAssets(true);
    try {
      // Use the selected multisig wallet address
      const currentMultisigAddress = selectedMultisigWalletAddress;
      
      // Use the same API endpoint with multisig address
      const response = await fetch('/api/total-balance-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: currentMultisigAddress }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert API data to Asset format with random whitelist status (should come from API)
      const formattedAssets: Asset[] = data.map((item: ApiAsset, index: number) => ({
        id: index.toString(),
        name: item.symbol,
        symbol: item.symbol,
        balance: parseFloat(item.balance) || 0,
        price: parseFloat(item.tokenPrice) || 0,
        value: parseFloat(item.value) || 0,
        change24h: 0,
        chain: item.chain,
        chainIndex: item.chainIndex,
        tokenAddress: item.tokenAddress,
        decimals: item.decimals || 18, // Default to 18 if not provided
        logoUrl: item.icon || undefined,
        // Simulate whitelist status - should come from API
        isWhitelisted: Math.random() > 0.3 // 70% chance of being whitelisted
      }));
      
      setMultisigAssets(formattedAssets);
      
      // Calculate total balance
      const total = formattedAssets.reduce((sum, asset) => sum + asset.value, 0);
      setTotalBalance(total);
    } catch (error) {
      console.error('Error fetching multisig assets:', error);
      // Use mock data as fallback
      setMultisigAssets([
        { 
          id: '1', 
          name: 'Ethereum', 
          symbol: 'ETH', 
          balance: 1.8, 
          price: 3500, 
          value: 6300, 
          change24h: 1.2, 
          chain: 'Ethereum', 
          isWhitelisted: true,
          tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH contract
          decimals: 18
        },
        { 
          id: '2', 
          name: 'USD Coin', 
          symbol: 'USDC', 
          balance: 10000, 
          price: 1, 
          value: 10000, 
          change24h: 0, 
          chain: 'Ethereum', 
          isWhitelisted: true,
          tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC contract
          decimals: 6
        },
        { 
          id: '3', 
          name: 'ChainLink', 
          symbol: 'LINK', 
          balance: 80, 
          price: 15, 
          value: 1200, 
          change24h: -0.5, 
          chain: 'Ethereum', 
          isWhitelisted: false,
          tokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK contract
          decimals: 18
        }
      ]);
      
      if (walletType === 'multisig') {
        setTotalBalance(17500); // Mock total balance
      }
    } finally {
      setLoadingAssets(false);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async (addr: string) => {
    if (!address) return;
    
    setLoadingTransactions(true);
    
    try {
      // Try to fetch swap history from wallet service
      const walletTransactions = await WalletService.walletControllerSwapHistory({
        safeWalletAddress: addr,
        chain: chainId?.toString()
      }).then((res: { transactions: { hash: string; type: string; timestamp: string }[] }) => res.transactions.map((v: { hash: string; type: string; timestamp: string }) => {
        return {
          ...v,
          timestamp: new Date(v.timestamp).toLocaleTimeString()
        };
      })).catch((error: unknown) => {
        console.error('Error fetching wallet transactions:', error);
        return [];
      });
      
      // Fetch from API route
      const response = await fetch('/api/wallet-transaction-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: addr }),
      });
      
      let apiTransactions: Transaction[] = [];
      if (response.ok) {
        const data = await response.json();
        
        // Convert API data to Transaction format
        apiTransactions = data.map((item: { txHash: string; type: string; amount: string; value?: string; time: string; status: string; chain: string; details: Record<string, unknown> }) => {
          const type = item.type === 'Send' ? 'Send' : 
            item.type === 'Receive' ? 'Receive' : 'Swap';
          
          return {
            hash: item.txHash,
            type: type as 'Send' | 'Receive' | 'Swap',
            from: type === 'Receive' ? 'External' : 'Personal Wallet',
            to: type === 'Send' ? 'External' : 'Personal Wallet',
            amount: item.amount,
            value: item.value || item.amount,
            timestamp: item.time,
            status: item.status.toLowerCase() as 'pending' | 'completed' | 'failed',
            chain: item.chain,
            details: item.details
          };
        });
      }
      
      // Merge wallet and API transactions
      const combinedTransactions: Transaction[] = [...apiTransactions];
      
      // Add wallet transactions
    walletTransactions.forEach((tx: 
      { hash: string; type: string; timestamp: string }) => {
        combinedTransactions.push({
          hash: tx.hash,
          type: ['Swap', 'Send', 'Receive'].includes(tx.type) ? tx.type as 'Swap' | 'Send' | 'Receive' : 'Swap',
          from: 'Personal Wallet',
          to: 'External',
          amount: '0.5 ETH',
          value: '$1,750.00',
          timestamp: tx.timestamp,
          status: 'completed',
          chain: 'Ethereum'
        });
      });
      
      // Sort by timestamp (newest first) and filter out zero amounts
      const sortedTransactions = combinedTransactions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .filter(item => !item.amount?.includes('0 ETH'));
      
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Use mock data as fallback
      setTransactions([
        {
          hash: '0x1234...5678',
          type: 'Swap',
          from: 'ETH',
          to: 'USDC',
          amount: '1.5 ETH',
          value: '$5,250.00',
          timestamp: '2025-03-05 14:30',
          status: 'completed',
          chain: 'Ethereum'
        },
        {
          hash: '0xabcd...ef01',
          type: 'Send',
          from: 'Personal Wallet',
          to: 'Multi-Sig Wallet',
          amount: '1000 USDC',
          value: '$1,000.00',
          timestamp: '2025-03-04 09:15',
          status: 'completed',
          chain: 'Ethereum'
        }
      ]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Refresh all data
  const handleRefresh = () => {
    setRefreshing(true);
    
    Promise.all([
      refetchWallets(),
      walletType === 'personal' ? fetchPersonalAssets() : fetchMultisigAssets(),
      fetchTransactions(walletType === 'personal' ? address || '' : selectedMultisigWalletAddress)
    ]).finally(() => {
      setRefreshing(false);
      setSuccessMessage('Assets refreshed successfully');
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 3000);
    });
  };

  // Refresh when wallet changes
  useEffect(() => {
    if (mounted && isConnected && address) {
      handleRefresh();
    }
  }, [address, chainId, walletType]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearch(''); // Clear search
    setSortColumn('value'); // Reset sort to default
    setSortDirection('desc'); // Reset sort direction to default
  };

  // Open deposit dialog
  const handleDepositOpen = (asset?: Asset) => {
    setSelectedAsset(asset || null);
    setDepositOpen(true);
  };

  // Close deposit dialog
  const handleDepositClose = () => {
    setSelectedAsset(null);
    setDepositOpen(false);
  };

  // Handle deposit submit
  const handleDepositSubmit = (token: string, amount: string) => {
    console.log('Depositing', amount, token);
    handleDepositClose();
    
    // Simulate API call
    setSuccessMessage(`Successfully deposited ${amount} ${token}`);
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 3000);
    
    // Refresh assets
    setTimeout(() => {
      if (walletType === 'personal') {
        fetchPersonalAssets();
      } else {
        fetchMultisigAssets();
      }
    }, 1000);
  };
  
  // Handle personal deposit
  const handlePersonalDeposit = (asset: Asset) => {
    console.log('Deposit to personal wallet:', asset);
    setSelectedAsset(asset);
    setDepositOpen(true);
  };

  // Available tokens for transfer
  const availableTokensForTransfer = personalAssets.map(asset => ({
    symbol: asset.symbol,
    name: asset.name,
    balance: asset.balance,
    value: asset.value,
    tokenAddress: asset.tokenAddress,
    decimals: asset.decimals,
    chain: asset.chain || 'Ethereum',
    chainId: asset.chainIndex ? parseInt(asset.chainIndex) : chainId || 1,
  }));

  // Token balances map
  const tokenBalancesMap = currentAssets.reduce((acc, asset) => {
    acc[asset.symbol] = asset.balance;
    return acc;
  }, {} as {[key: string]: number});
  
  // Withdraw hook
  const withdrawFromSafe = useWithdrawFromSafe();
  
  // Handle withdraw action on asset
  const handleMultisigWithdraw = async (asset: Asset) => {
    console.log('Withdraw from multisig wallet:', asset);
    const tokenAddress = asset.tokenAddress || null;
    if(!tokenAddress) {
      return;
    }
    
    // Get the selected wallet name
    const selectedWallet = relatedMultisigWallets.find(wallet => wallet.multisig_address === selectedMultisigWalletAddress);
    const walletName = selectedWallet?.name || 'Multi-Signature wallet';
    
    try {
      // Get token information
      const assetInfo = await AssetService.assetControllerGetAssetsList({
        chainId: chainId?.toString() || '1'
      });
      
    const targetAsset: { address: string; token: { decimals: number } } | undefined = assetInfo.data.find(
      (a: { address: string }) => a.address.toLowerCase() === tokenAddress.toLowerCase()
    );
      if (!targetAsset) {
        throw new Error('Token info not found');
      }
      
      const decimals = targetAsset.token.decimals;

      // Execute withdrawal
      await withdrawFromSafe(
        selectedMultisigWalletAddress,
        tokenAddress,
        asset.balance.toString(),
        address || '',
        decimals,
      );
      
      setSuccessMessage(`Withdrawal request submitted for ${asset.balance} ${asset.symbol} from ${walletName}`);
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 5000);
    } catch (error) {
      console.error('Error withdrawing from safe:', error);
      setSuccessMessage(`Error: ${error instanceof Error ? error.message : 'Failed to withdraw asset'}`);
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 5000);
    }
  };

  // Handle transfer between wallets
  const handleTransfer = (data: { token: string; amount: string; recipient: string }) => {
    console.log('Transferring', data.amount, data.token, 'to', data.recipient);
    
    // The actual transfer is handled by the QuickTransferCard component
    
    setSuccessMessage(`Transfer of ${data.amount} tokens to ${data.recipient.substring(0, 6)}...${data.recipient.substring(data.recipient.length - 4)} initiated`);
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 5000);
    
    // Refresh assets after a short delay
    setTimeout(() => {
      fetchPersonalAssets();
      fetchMultisigAssets();
    }, 3000);
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // Default to descending
    }
  };

  // Filter and sort assets
  const filterAndSortAssets = (assets: Asset[]) => {
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
  };

  const filteredAssets = filterAndSortAssets(currentAssets);

  // Handle multisig wallet selection
  const handleMultisigWalletChange = (walletAddress: string) => {
    setSelectedMultisigWalletAddress(walletAddress);
  };

  // Handle creating a new multisig wallet
  const handleCreateMultisig = async () => {
    try {
      // Show loading state
      setLoadingRelatedWallets(true);
      
      // Refresh the wallet list
      await refetchWallets();
      
      // Show success message
      setSuccessMessage('Multi-signature wallet created successfully!');
      setSuccessAlert(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessAlert(false);
      }, 5000);
    } catch (error) {
      console.error('Error refreshing wallet list:', error);
    } finally {
      setLoadingRelatedWallets(false);
    }
  };

  // Show nothing when not mounted (to prevent hydration issues)
  if (!mounted) {
    return null;
  }

  // Get wallet data for WalletOverview
  const wallet = {
    address: address || '',
    totalValue: totalBalance,
    change24h: 1.2, // Mock 24h change
  };

  return (
    <div>
      <Box sx={{ mb: 4 }}>
        <Typography component="h1" gutterBottom variant="h4">
          Portfolio
        </Typography>
        <Typography color="text.secondary" variant="body1">
          Manage your assets, transfers, and transactions across all your wallets
        </Typography>
      </Box>

      {!isConnected ? (
        <Box
          sx={{ 
            textAlign: 'center', 
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              mb: 2
            }}
          >
            <WalletIcon fontSize="large" />
          </Box>
          <Typography gutterBottom variant="h6">
            Please connect your wallet to view your assets
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 500, mb: 3 }} variant="body2">
            Connect your wallet to manage your assets, view your portfolio, and execute transfers between wallets.
          </Typography>
        </Box>
      ) : (
        <>
          {/* Success alert */}
          {successAlert && (
            <Alert 
              onClose={() => setSuccessAlert(false)} 
              severity="success"
              sx={{ mb: 3 }}
            >
              <AlertTitle>Success</AlertTitle>
              {successMessage}
            </Alert>
          )}
          
          {/* Wallet Overview */}
          <WalletOverview
            wallet={wallet}
            onDeposit={() => handleDepositOpen()}
          />
          
          {/* Quick transfer card */}
          <QuickTransferCard
            availableTokens={availableTokensForTransfer}
            isLoadingWallets={isLoadingWallets}
            onCreateMultisig={handleCreateMultisig}
            onTransfer={handleTransfer}
            relatedWallets={relatedMultisigWallets}
            totalBalance={totalBalance}
            userWalletAddress={address || ''}
            userWalletName={walletType === 'personal' 
              ? 'My Personal Wallet' 
              : relatedMultisigWallets.find(wallet => wallet.multisig_address === selectedMultisigWalletAddress)?.name || 'My Multi-Signature Wallet'
            }
          />

          {/* Wallet type tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              TabIndicatorProps={{
                style: {
                  backgroundColor: theme.palette.primary.main,
                  height: 3
                }
              }} 
              onChange={handleTabChange}
              value={tabValue}
            >
              <Tab 
                label="Personal Wallet" 
                sx={{ 
                  fontWeight: tabValue === 0 ? 600 : 400,
                  color: tabValue === 0 ? theme.palette.primary.main : theme.palette.text.primary
                }}
              />
              <Tab 
                label="Multi-Signature Wallet" 
                sx={{ 
                  fontWeight: tabValue === 1 ? 600 : 400,
                  color: tabValue === 1 ? theme.palette.primary.main : theme.palette.text.primary
                }}
              />
            </Tabs>
          </Box>

          {/* Multi-signature wallet selector (only shown when multi-sig tab is selected) */}
          {tabValue === 1 && (
            <Box sx={{ mb: 3 }}>
              {isLoadingWallets ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Loading wallets...</Typography>
                </Box>
              ) : walletsError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Error loading multi-signature wallets. Please try again.
                </Alert>
              ) : relatedMultisigWallets.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No multi-signature wallets found. Create one to get started.
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ minWidth: 120 }} variant="body2">
                    Select wallet:
                  </Typography>
                  <TextField
                    SelectProps={{
                      native: true,
                    }}
                    onChange={(e) => handleMultisigWalletChange(e.target.value)}
                    select
                    size="small"
                    sx={{ 
                      minWidth: 300,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    value={selectedMultisigWalletAddress}
                  >
                    {relatedMultisigWallets.map((wallet) => (
                      <option key={wallet.multisig_address} value={wallet.multisig_address}>
                        {wallet.name}
                      </option>
                    ))}
                  </TextField>
                </Box>
              )}
            </Box>
          )}

          {/* Search and action buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}
          >
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              size="small"
              sx={{ 
                flexGrow: 1, 
                maxWidth: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
              value={search}
              variant="outlined"
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                disabled={refreshing || loadingAssets || loadingTransactions}
                onClick={handleRefresh}
                size="small"
                sx={{ 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  p: 1
                }}
              >
                {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
              
              <Button 
                startIcon={<FilterListIcon />} 
                sx={{ borderRadius: 2 }}
                variant="outlined"
              >
                Filter
              </Button>
              
              <Button 
                color="primary" 
                onClick={() => handleDepositOpen()}
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2 }}
                variant="contained"
              >
                Deposit
              </Button>
            </Box>
          </Box>

          {/* Asset table */}
          {loadingAssets ? (
            <Box sx={{ mb: 4, p: 3, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <AssetTable 
              assets={filteredAssets} 
              onDeposit={handlePersonalDeposit} 
              onSort={handleSort} 
              onWithdraw={handleMultisigWithdraw}
              selectedWalletAddress={walletType === 'multisig' ? selectedMultisigWalletAddress : undefined}
              selectedWalletName={walletType === 'multisig' 
                ? relatedMultisigWallets.find(wallet => wallet.multisig_address === selectedMultisigWalletAddress)?.name 
                : undefined
              }
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              walletType={walletType}
            />
          )}

          {/* Transaction history */}
          {loadingTransactions ? (
            <Box sx={{ mb: 4, p: 3, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <TransactionHistory transactions={transactions} />
          )}

          {/* Deposit dialog */}
          <DepositDialog 
            onClose={handleDepositClose} 
            onSubmit={handleDepositSubmit} 
            open={depositOpen} 
            preSelectedAmount={selectedAsset?.balance.toString()}
            preSelectedToken={selectedAsset?.symbol}
            selectedWalletName={walletType === 'multisig' && selectedMultisigWalletAddress
              ? relatedMultisigWallets.find(wallet => wallet.multisig_address === selectedMultisigWalletAddress)?.name
              : undefined
            }
            tokenBalances={tokenBalancesMap}
            walletType={walletType}
          />
        </>
      )}
    </div>
  );
}