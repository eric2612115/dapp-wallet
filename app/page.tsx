'use client';

import React, { useState } from 'react';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import { WalletProvider, useWalletContext } from '@/contexts/WalletContext';
import PersonalWalletView from '@/components/views/PersonalWalletView';
import MultisigWalletView from '@/components/views/MultisigWalletView';
import WalletTabs from '@/components/portfolio/WalletTabs';
import AlertContainer from '@/components/shared/AlertContainer';
import usePageView from '@/lib/hooks/usePageView';

// Main app container
const HomePage = () => {
  usePageView();
  
  return (
    <WalletProvider>
      <WalletDashboard />
      <AlertContainer />
    </WalletProvider>
  );
};

// Dashboard component - separated to use wallet context
const WalletDashboard = () => {
  const { isConnected, mounted } = useWalletContext();
  const [tabValue, setTabValue] = useState(0);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Show nothing when not mounted (to prevent hydration issues)
  if (!mounted) {
    return null;
  }
  
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
          {/* Wallet type tabs */}
          <WalletTabs
            tabValue={tabValue}
            handleTabChange={handleTabChange}
          />
          
          {/* Render the appropriate view based on the selected tab */}
          {tabValue === 0 ? <PersonalWalletView /> : <MultisigWalletView />}
        </>
      )}
    </div>
  );
};

export default HomePage;