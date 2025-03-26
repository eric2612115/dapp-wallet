// app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { WalletService } from '@/lib/wallet';
import { useQueryWallets } from '@/hooks/useQueryWallets';
import { Asset } from '@/components/portfolio/AssetTable';
import { Transaction } from '@/components/portfolio/TransactionHistory';
import { mockAssets, mockTransactions, getMockWalletData } from '@/mockData/dashboardData';
import AssetSummaryCard from '@/components/dashboard/AssetSummaryCard';
import RecentTransactionsCard from '@/components/dashboard/RecentTransactionsCard';
import MarketInsightsCard from '@/components/dashboard/MarketInsightsCard';
import ActionButtonsCard from '@/components/dashboard/ActionButtonsCard';
import WalletOverview from '@/components/portfolio/WalletOverview';

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletData, setWalletData] = useState({
    address: '',
    totalValue: 0,
    change24h: 0
  });
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch multi-signature wallets using the hook
  const { 
    data: walletsData,
    isLoading: isLoadingWallets,
    refetch: refetchWallets
  } = useQueryWallets({
    chain: chainId,
    ownerAddress: address || '',
    enabled: mounted && isConnected && Boolean(address)
  });

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial data loading
  useEffect(() => {
    if (mounted && isConnected && address) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [mounted, isConnected, address, chainId]);

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      await Promise.all([
        fetchWalletData(),
        fetchAssets(),
        fetchTransactions(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    if (!isConnected || !address) return;
    
    setRefreshing(true);
    
    try {
      await loadDashboardData();
      refetchWallets();
      
      setSuccessMessage('Dashboard refreshed successfully');
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    if (!address) return;
    
    try {
      // In a real implementation, fetch from API
      const mockData = getMockWalletData(address);
      setWalletData(mockData);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  // Fetch assets
  const fetchAssets = async () => {
    if (!address) return;
    
    try {
      // Try to fetch real data (implement API call here)
      // For now, use mock data
      setAssets(mockAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setAssets(mockAssets);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    if (!address) return;
    
    try {
      // Try to fetch using the wallet service
      const walletTransactions = await WalletService.walletControllerSwapHistory({
        safeWalletAddress: address,
      }).then((res) => res.transactions.map(v => {
        v.timestamp = new Date(v.timestamp).toLocaleTimeString();
        return v;
      })).catch(() => []);
      
      // Format transactions
      const formattedTransactions: Transaction[] = walletTransactions.map(tx => ({
        hash: tx.hash,
        type: tx.type,
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        value: tx.value || tx.amount,
        timestamp: tx.timestamp,
        status: tx.status,
        chain: tx.chain || 'Ethereum',
        details: tx.details,
        chainIndex: tx.chainIndex
      }));
      
      if (formattedTransactions.length > 0) {
        setTransactions(formattedTransactions.slice(0, 5));
      } else {
        // Use mock data as fallback
        setTransactions(mockTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions(mockTransactions);
    }
  };

  // Deposit handler (implement this based on your flow)
  const handleDeposit = () => {
    console.log('Deposit action triggered');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="mt-4">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-text-secondary mb-4">
          Overview of your wallet, assets, and recent activity
        </p>
      </div>

      {/* Success alert */}
      {successAlert && (
        <div className="bg-accent-success bg-opacity-10 border border-accent-success border-opacity-20 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-accent-success" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-accent-success">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                type="button"
                className="inline-flex text-accent-success"
                onClick={() => setSuccessAlert(false)}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isConnected ? (
        // Not connected state
        <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-hover border border-border rounded-lg">
          <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet to Access the Dashboard</h2>
          <p className="text-text-secondary max-w-md mb-6">
            Connect your wallet to view your portfolio, track your assets, and execute transactions across multiple chains.
          </p>
          <button className="btn btn-primary">
            Connect Wallet
          </button>
        </div>
      ) : loading ? (
        // Loading state
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Loading your dashboard...</p>
        </div>
      ) : (
        // Dashboard content
        <div>
          {/* Refresh button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-outline flex items-center space-x-2"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>

          {/* Wallet overview */}
          <WalletOverview 
            wallet={{
              address: address || '',
              totalValue: walletData.totalValue,
              change24h: walletData.change24h
            }}
            onDeposit={handleDeposit}
          />

          {/* Dashboard grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            {/* Asset summary */}
            <div className="md:col-span-7">
              <AssetSummaryCard assets={assets.slice(0, 3)} />
            </div>

            {/* Quick actions */}
            <div className="md:col-span-5">
              <ActionButtonsCard 
                wallets={walletsData?.safeWalletList || []}
                isLoadingWallets={isLoadingWallets}
              />
            </div>

            {/* Recent transactions */}
            <div className="md:col-span-7">
              <RecentTransactionsCard transactions={transactions} />
            </div>

            {/* Market insights */}
            <div className="md:col-span-5">
              <MarketInsightsCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}