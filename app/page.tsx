// app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';

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
import { Alert } from '@/components/ui/Alert';

import type { Asset } from '@/types/assets';

export default function HomePage() {
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

  // Open deposit dialog - safely handle the case when no asset is provided
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
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-warm-text dark:text-white mb-1">
          DApp Wallet Dashboard
        </h1>
        <p className="text-warm-textSecondary dark:text-gray-300">
          Manage your assets, transfers, and transactions across all your wallets
        </p>
      </div>

      {!isConnected ? (
        <div className="text-center py-8 flex flex-col items-center justify-center bg-warm-paper dark:bg-dark-200 rounded-lg border border-warm-divider dark:border-dark-100">
          <div className="bg-warm-bg dark:bg-warm-primary/30 text-warm-primary dark:text-warm-secondary w-16 h-16 flex items-center justify-center rounded-full mb-2">
            <WalletIcon fontSize="large" />
          </div>
          <h2 className="text-xl font-semibold text-warm-text dark:text-white mb-2">
            Please connect your wallet to view your assets
          </h2>
          <p className="text-warm-textSecondary dark:text-gray-400 max-w-md mb-6">
            Connect your wallet to manage your assets, view your portfolio, and execute transfers between wallets.
          </p>
        </div>
      ) : (
        <>
          {/* Success alert */}
          {successAlert && (
            <Alert 
              variant="success" 
              title="Success"
              onClose={() => setSuccessAlert(false)}
              className="mb-4"
            >
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
            <div className="mb-4 p-3 flex justify-center text-warm-textSecondary dark:text-gray-400">
              Loading assets...
            </div>
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
            <div className="mb-4 p-3 flex justify-center text-warm-textSecondary dark:text-gray-400">
              Loading transactions...
            </div>
          ) : (
            <TransactionHistory 
              transactions={transactions.map(tx => ({
                ...tx,
                // Convert details to string if it's an object
                details: tx.details ? (typeof tx.details === 'string' ? tx.details : JSON.stringify(tx.details)) : undefined
              }))} 
            />
          )}

          {/* Deposit dialog - with safe handling of undefined values */}
          <DepositDialog 
            onClose={handleDepositClose} 
            onSubmit={handleDepositSubmit} 
            open={depositOpen} 
            preSelectedAmount={selectedAsset?.balance?.toString()} // Add null check with ?. operator
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