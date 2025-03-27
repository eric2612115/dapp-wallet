'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { useAssets } from '@/lib/hooks/useAssets';
import { useTransactions } from '@/lib/hooks/useTransactions';

import EnhancedMultisigWalletSelector from '@/components/portfolio/EnhancedMultisigWalletSelector';
import AssetControls from '@/components/portfolio/AssetControls';
import AssetTable from '@/components/portfolio/AssetTable';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import DepositDialog from '@/components/portfolio/DepositDialog';
import TransferCard from '@/components/portfolio/TransferCard';
import WalletOverview from '@/components/portfolio/WalletOverview';
import WithdrawDialog from '@/components/portfolio/WithdrawDialog';

import type { Asset } from '@/types/assets';

interface MultisigWalletViewProps {
  onAlert?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const MultisigWalletView: React.FC<MultisigWalletViewProps> = ({ onAlert }) => {
  const { 
    address,
    isConnected, 
    mounted,
    relatedMultisigWallets,
    selectedMultisigWalletAddress,
    isLoadingWallets,
    walletsError,
    setSelectedMultisigWalletAddress,
    addAlert
  } = useWalletContext();
  
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState('');
  
  // Find the selected wallet
  const selectedWallet = relatedMultisigWallets.find(wallet => 
    wallet.multisig_address === selectedMultisigWalletAddress
  );
  
  // Use hooks for assets and transactions
  const {
    assets: multisigAssets,
    loadingAssets: loadingMultisigAssets,
    fetchAssets: fetchMultisigAssets,
    sortColumn,
    sortDirection,
    handleSort,
    filteredAssets: filteredMultisigAssets,
  } = useAssets(selectedMultisigWalletAddress, search, 'multisig');
  
  const {
    transactions,
    loadingTransactions,
    fetchTransactions
  } = useTransactions(address || '', 'multisig', selectedMultisigWalletAddress);
  
  // Fetch assets when wallet address changes
  useEffect(() => {
    if (mounted && isConnected && selectedMultisigWalletAddress) {
      fetchMultisigAssets();
      fetchTransactions(selectedMultisigWalletAddress);
    }
  }, [mounted, isConnected, selectedMultisigWalletAddress, fetchMultisigAssets, fetchTransactions]);
  
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
    
    const message = `Successfully deposited ${amount} ${token} to ${selectedWallet?.name || 'multisig wallet'}`;
    if (onAlert) {
      onAlert(message, 'success');
    } else {
      addAlert({ type: 'success', message });
    }
    
    // Refresh assets
    setTimeout(() => {
      fetchMultisigAssets();
    }, 1000);
  }, [handleDepositClose, selectedWallet, onAlert, addAlert, fetchMultisigAssets]);
  
  // Open withdraw dialog
  const handleWithdrawOpen = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setWithdrawOpen(true);
  }, []);
  
  // Close withdraw dialog
  const handleWithdrawClose = useCallback(() => {
    setSelectedAsset(null);
    setWithdrawOpen(false);
  }, []);
  
  // Handle withdraw submit
  const handleWithdrawSubmit = useCallback((token: string, amount: string) => {
    handleWithdrawClose();
    
    const message = `Withdrawal request for ${amount} ${token} from ${selectedWallet?.name || 'multisig wallet'} initiated`;
    if (onAlert) {
      onAlert(message, 'success');
    } else {
      addAlert({ type: 'success', message, title: 'Withdrawal Initiated' });
    }
    
    // Refresh assets
    setTimeout(() => {
      fetchMultisigAssets();
    }, 1000);
  }, [handleWithdrawClose, selectedWallet, onAlert, addAlert, fetchMultisigAssets]);
  
  // Handle withdrawal from the card
  const handleWithdrawFromCard = useCallback((token: string) => {
    const asset = multisigAssets.find(a => a.symbol === token);
    if (asset) {
      setSelectedAsset(asset);
      setWithdrawOpen(true);
    }
  }, [multisigAssets]);
  
  // Refresh all data
  const handleRefresh = useCallback(() => {
    Promise.all([
      fetchMultisigAssets(),
      fetchTransactions(selectedMultisigWalletAddress)
    ]).then(() => {
      const message = 'Assets refreshed successfully';
      if (onAlert) {
        onAlert(message, 'success');
      } else {
        addAlert({ type: 'success', message });
      }
    });
  }, [fetchMultisigAssets, fetchTransactions, selectedMultisigWalletAddress, onAlert, addAlert]);
  
  // Token balances map
  const tokenBalancesMap = multisigAssets.reduce((acc, asset) => {
    acc[asset.symbol] = asset.balance;
    return acc;
  }, {} as {[key: string]: number});
  
  // Get wallet data for WalletOverview
  const walletBalance = multisigAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  // Create a virtual wallet for the overview
  const wallet = {
    address: selectedMultisigWalletAddress,
    totalValue: walletBalance,
    change24h: 0.8, // Mock 24h change
  };
  
  return (
    <>
      {/* Multisig wallet selector */}
      <EnhancedMultisigWalletSelector
        isLoadingWallets={isLoadingWallets}
        walletsError={walletsError}
        wallets={relatedMultisigWallets}
        selectedWalletAddress={selectedMultisigWalletAddress}
        onChange={setSelectedMultisigWalletAddress}
      />
      
      {selectedMultisigWalletAddress && (
        <>
          {/* Wallet Overview - Adapted to match Image 3 */}
          <WalletOverview
            wallet={wallet}
            onDeposit={() => handleDepositOpen()}
            isMultisig
            multisigInfo={selectedWallet}
          />
          
          {/* Withdraw Card - Fixed arrow direction as in Image 3 */}
          <TransferCard
            walletType="multisig"
            availableTokens={multisigAssets.map(asset => ({
              symbol: asset.symbol,
              name: asset.name,
              balance: asset.balance,
              value: asset.value,
              tokenAddress: asset.tokenAddress,
              decimals: asset.decimals,
              chain: asset.chain || 'Ethereum',
              chainId: asset.chainIndex ? parseInt(asset.chainIndex.toString()) : 1,
            }))}
            selectedWallet={selectedWallet}
            userWalletAddress={address || ''}
            userWalletName="My Personal Wallet"
            onWithdraw={handleWithdrawFromCard}
          />
          
          {/* Search and action buttons */}
          <AssetControls
            search={search}
            setSearch={setSearch}
            refreshing={loadingMultisigAssets || loadingTransactions}
            handleRefresh={handleRefresh}
            handleDepositOpen={handleDepositOpen}
          />
          
          {/* Asset table */}
          {loadingMultisigAssets ? (
            <div className="mb-4 p-3 flex justify-center text-warm-textSecondary dark:text-gray-400">
              Loading assets...
            </div>
          ) : (
            <AssetTable 
              assets={filteredMultisigAssets} 
              onSort={handleSort}
              onWithdraw={handleWithdrawOpen}
              selectedWalletAddress={selectedMultisigWalletAddress}
              selectedWalletName={selectedWallet?.name}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              walletType="multisig"
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
            selectedWalletName={selectedWallet?.name}
            tokenBalances={tokenBalancesMap}
            walletType="multisig"
          />
          
          {/* Withdraw dialog */}
          <WithdrawDialog
            onClose={handleWithdrawClose}
            onSubmit={handleWithdrawSubmit}
            open={withdrawOpen}
            asset={selectedAsset}
            walletName={selectedWallet?.name || 'Multisig Wallet'}
            requiredSignatures={selectedWallet?.requiredSignatures || 2}
            totalSigners={selectedWallet?.totalSigners || 3}
            signers={selectedWallet?.signers || []}
          />
        </>
      )}
    </>
  );
};

export default MultisigWalletView;