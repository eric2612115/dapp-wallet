'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { useAssets } from '@/lib/hooks/useAssets';
import { useTransactions } from '@/lib/hooks/useTransactions';

import WalletOverview from '@/components/portfolio/WalletOverview';
import TransferCard from '@/components/portfolio/TransferCard';
import AssetControls from '@/components/portfolio/AssetControls';
import AssetTable from '@/components/portfolio/AssetTable';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import DepositDialog from '@/components/portfolio/DepositDialog';

import type { Asset } from '@/types/assets';

interface PersonalWalletViewProps {
  onAlert?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const PersonalWalletView: React.FC<PersonalWalletViewProps> = ({ onAlert }) => {
  const { 
    address, 
    isConnected, 
    mounted, 
    totalBalance, 
    relatedMultisigWallets,
    addAlert,
    handleCreateMultisig
  } = useWalletContext();
  
  const [depositOpen, setDepositOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState('');
  
  // Use hooks for assets and transactions
  const {
    assets: personalAssets,
    loadingAssets: loadingPersonalAssets,
    fetchAssets: fetchPersonalAssets,
    sortColumn,
    sortDirection,
    handleSort,
    filteredAssets: filteredPersonalAssets,
  } = useAssets(address || '', search, 'personal');
  
  const {
    transactions,
    loadingTransactions,
    fetchTransactions
  } = useTransactions(address || '', 'personal');
  
  // Fetch assets when wallet connected
  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchPersonalAssets();
      fetchTransactions(address);
    }
  }, [mounted, isConnected, address, fetchPersonalAssets, fetchTransactions]);
  
  // Open deposit dialog
  const handleDepositOpen = useCallback((asset?: Asset) => {
    setSelectedAsset(asset || null);
    setDepositOpen(true);
  }, []);
  
  // Close deposit dialog
  const handleDepositClose = useCallback(() => {
    setSelectedAsset(null);
    setDepositOpen(false);
  }, []);
  
  // Handle deposit submit
  const handleDepositSubmit = useCallback((token: string, amount: string) => {
    handleDepositClose();
    
    const message = `Successfully deposited ${amount} ${token}`;
    if (onAlert) {
      onAlert(message, 'success');
    } else {
      addAlert({ type: 'success', message });
    }
    
    // Refresh assets
    setTimeout(() => {
      fetchPersonalAssets();
    }, 1000);
  }, [handleDepositClose, onAlert, addAlert, fetchPersonalAssets]);
  
  // Refresh all data
  const handleRefresh = useCallback(() => {
    Promise.all([
      fetchPersonalAssets(),
      fetchTransactions(address || '')
    ]).then(() => {
      const message = 'Assets refreshed successfully';
      if (onAlert) {
        onAlert(message, 'success');
      } else {
        addAlert({ type: 'success', message });
      }
    });
  }, [fetchPersonalAssets, fetchTransactions, address, onAlert, addAlert]);
  
  // Handle personal deposit
  const handlePersonalDeposit = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setDepositOpen(true);
  }, []);
  
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
  const tokenBalancesMap = personalAssets.reduce((acc, asset) => {
    acc[asset.symbol] = asset.balance;
    return acc;
  }, {} as {[key: string]: number});
  
  // Handle transfer between wallets
  const handleTransfer = useCallback((data: { token: string; amount: string; recipient: string }) => {
    const message = `Transfer of ${data.amount} tokens to ${data.recipient.substring(0, 6)}...${data.recipient.substring(data.recipient.length - 4)} initiated`;
    if (onAlert) {
      onAlert(message, 'success');
    } else {
      addAlert({ type: 'success', message });
    }
    
    // Refresh assets after a short delay
    setTimeout(() => {
      fetchPersonalAssets();
    }, 3000);
  }, [onAlert, addAlert, fetchPersonalAssets]);
  
  // Get wallet data for WalletOverview
  const wallet = {
    address: address || '',
    totalValue: totalBalance,
    change24h: 1.2, // Mock 24h change
  };
  
  return (
    <>
      {/* Wallet Overview - Simplified to match Image 2 */}
      <WalletOverview
        wallet={wallet}
        onDeposit={() => handleDepositOpen()}
      />
      
      {/* Quick transfer card */}
      <TransferCard
        walletType="personal"
        availableTokens={availableTokensForTransfer}
        relatedWallets={relatedMultisigWallets}
        totalBalance={totalBalance}
        userWalletAddress={address || ''}
        userWalletName="My Personal Wallet"
        onTransfer={handleTransfer}
        onCreateMultisig={handleCreateMultisig}
      />
      
      {/* Search and action buttons */}
      <AssetControls
        search={search}
        setSearch={setSearch}
        refreshing={loadingPersonalAssets || loadingTransactions}
        handleRefresh={handleRefresh}
        handleDepositOpen={handleDepositOpen}
      />
      
      {/* Asset table */}
      {loadingPersonalAssets ? (
        <div className="mb-4 p-3 flex justify-center text-warm-textSecondary dark:text-gray-400">
          Loading assets...
        </div>
      ) : (
        <AssetTable 
          assets={filteredPersonalAssets} 
          onDeposit={handlePersonalDeposit} 
          onSort={handleSort} 
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          walletType="personal"
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
            details: tx.details ? (typeof tx.details === 'string' ? tx.details : JSON.stringify(tx.details)) : undefined
          }))} 
        />
      )}
      
      {/* Deposit dialog */}
      <DepositDialog 
        onClose={handleDepositClose} 
        onSubmit={handleDepositSubmit} 
        open={depositOpen} 
        preSelectedAmount={selectedAsset?.balance?.toString()}
        preSelectedToken={selectedAsset?.symbol}
        tokenBalances={tokenBalancesMap}
        walletType="personal"
      />
    </>
  );
};

export default PersonalWalletView;