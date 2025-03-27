'use client';
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, alpha, Box, Typography, useTheme } from '@mui/material';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import { useAccount } from 'wagmi';

import { useAssets } from '@/lib/hooks/useAssets';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useWalletData } from '@/lib/hooks/useWalletData';
import usePageView from '@/lib/hooks/usePageView';

import WalletOverview from '@/components/portfolio/WalletOverview';
import QuickTransferCard from '@/components/portfolio/QuickTransferCard';
import WalletTabs from '@/components/portfolio/WalletTabs';
import MultisigWalletSelector from '@/components/portfolio/MultisigWalletSelector';
import AssetControls from '@/components/portfolio/AssetControls';
import AssetTable from '@/components/portfolio/AssetTable';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import DepositDialog from '@/components/portfolio/DepositDialog';

import type { Asset } from '@/types/assets';

export default function HomePage() {
  const theme = useTheme();
  usePageView();
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [depositOpen, setDepositOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  
  // Wallet type
  const walletType = tabValue === 0 ? 'personal' : 'multisig';
  
  // Custom hooks
  const { 
    totalBalance,
    relatedMultisigWallets,
    selectedMultisigWalletAddress,
    isLoadingWallets,
    walletsError,
    setSelectedMultisigWalletAddress,
    handleCreateMultisig,
    refetchWallets
  } = useWalletData(address, mounted, isConnected);
  
  const {
    assets: personalAssets,
    loadingAssets: loadingPersonalAssets,
    fetchAssets: fetchPersonalAssets,
    sortColumn,
    sortDirection,
    setSortColumn,
    setSortDirection,
    handleSort,
    filteredAssets: filteredPersonalAssets,
  } = useAssets(address || '', search, 'personal');
  
  const {
    assets: multisigAssets,
    loadingAssets: loadingMultisigAssets,
    fetchAssets: fetchMultisigAssets,
    filteredAssets: filteredMultisigAssets,
  } = useAssets(selectedMultisigWalletAddress, search, 'multisig', { sortColumn, sortDirection });
  
  const {
    transactions,
    loadingTransactions,
    fetchTransactions
  } = useTransactions(address || '', walletType, selectedMultisigWalletAddress);
  
  // Current assets based on selected wallet type
  const currentAssets = walletType === 'personal' ? personalAssets : multisigAssets;
  const filteredAssets = walletType === 'personal' ? filteredPersonalAssets : filteredMultisigAssets;
  const loadingAssets = walletType === 'personal' ? loadingPersonalAssets : loadingMultisigAssets;

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

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
    handleDepositClose();
    
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
    chainId: asset.chainIndex ? parseInt(asset.chainIndex.toString()) : 1,
  }));

  // Token balances map
  const tokenBalancesMap = currentAssets.reduce((acc, asset) => {
    acc[asset.symbol] = asset.balance;
    return acc;
  }, {} as {[key: string]: number});
  
  // Handle transfer between wallets
  const handleTransfer = (data: { token: string; amount: string; recipient: string }) => {
    setSuccessMessage(`Transfer of ${data.amount} tokens to ${data.recipient.substring(0, 6)}...${data.recipient.substring(data.recipient.length - 4)} initiated`);
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 5000);
    
    // Refresh assets after a short delay
    setTimeout(() => {
      fetchPersonalAssets();
      fetchMultisigAssets();
    }, 3000);
  };

  // Refresh all data
  const handleRefresh = () => {
    Promise.all([
      refetchWallets(),
      walletType === 'personal' ? fetchPersonalAssets() : fetchMultisigAssets(),
      fetchTransactions(walletType === 'personal' ? address || '' : selectedMultisigWalletAddress)
    ]).then(() => {
      setSuccessMessage('Assets refreshed successfully');
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 3000);
    });
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
          DApp Wallet Dashboard
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
          <WalletTabs
            tabValue={tabValue}
            handleTabChange={handleTabChange}
          />

          {/* Multi-signature wallet selector (only shown when multi-sig tab is selected) */}
          {tabValue === 1 && (
            <MultisigWalletSelector
              isLoadingWallets={isLoadingWallets}
              walletsError={walletsError}
              relatedMultisigWallets={relatedMultisigWallets}
              selectedMultisigWalletAddress={selectedMultisigWalletAddress}
              handleMultisigWalletChange={setSelectedMultisigWalletAddress}
            />
          )}

          {/* Search and action buttons */}
          <AssetControls
            search={search}
            setSearch={setSearch}
            refreshing={loadingAssets || loadingTransactions}
            handleRefresh={handleRefresh}
            handleDepositOpen={handleDepositOpen}
          />

          {/* Asset table */}
          {loadingAssets ? (
            <Box sx={{ mb: 4, p: 3, display: 'flex', justifyContent: 'center' }}>
              Loading assets...
            </Box>
          ) : (
            <AssetTable 
              assets={filteredAssets} 
              onDeposit={handlePersonalDeposit} 
              onSort={handleSort} 
              onWithdraw={() => {}} // Will be implemented in hook
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
              Loading transactions...
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