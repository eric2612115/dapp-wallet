'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useWalletData } from '@/lib/hooks/useWalletData';
import type { MultisigWallet } from '@/types/assets';

// Extended MultisigWallet type with signature information
export interface ExtendedMultisigWallet extends MultisigWallet {
  requiredSignatures: number;
  totalSigners: number;
  signers: Array<{
    address: string;
    hasSigned?: boolean;
    name?: string;
  }>;
}

// Type for alert messages
export interface AlertMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

// Context type definition
interface WalletContextType {
  // Current wallet state
  address: string | undefined;
  isConnected: boolean;
  mounted: boolean;
  chainId: number | undefined;
  totalBalance: number;
  
  // Multi-signature wallets
  relatedMultisigWallets: ExtendedMultisigWallet[];
  selectedMultisigWalletAddress: string;
  isLoadingWallets: boolean;
  walletsError: Error | null;
  
  // Pending approvals
  pendingApprovals: number;
  
  // Alerts
  alerts: AlertMessage[];
  
  // Functions
  setSelectedMultisigWalletAddress: (address: string) => void;
  handleCreateMultisig: () => Promise<void>;
  refetchWallets: () => Promise<void>;
  updateTotalBalance: (balance: number) => void;
  addAlert: (alert: Omit<AlertMessage, 'id'>) => void;
  removeAlert: (id: string) => void;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  address: undefined,
  isConnected: false,
  mounted: false,
  chainId: undefined,
  totalBalance: 0,
  relatedMultisigWallets: [],
  selectedMultisigWalletAddress: '',
  isLoadingWallets: false,
  walletsError: null,
  pendingApprovals: 0,
  alerts: [],
  setSelectedMultisigWalletAddress: () => {},
  handleCreateMultisig: async () => {},
  refetchWallets: async () => {},
  updateTotalBalance: () => {},
  addAlert: () => {},
  removeAlert: () => {},
});

// Provider component
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [mounted, setMounted] = useState(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  
  // Get wallet data from existing hook
  const { 
    totalBalance,
    updateTotalBalance,
    relatedMultisigWallets: baseMultisigWallets,
    selectedMultisigWalletAddress,
    isLoadingWallets,
    walletsError,
    setSelectedMultisigWalletAddress,
    handleCreateMultisig,
    refetchWallets
  } = useWalletData(address, mounted, isConnected);
  
  // Enhance multisig wallets with signature information
  const relatedMultisigWallets: ExtendedMultisigWallet[] = baseMultisigWallets.map((wallet, index) => {
    // Create wallet configurations with different signatures required
    let requiredSignatures = 2;
    let totalSigners = 3;
    
    // Add variety to the wallets
    if (index === 0) {
      requiredSignatures = 2;
      totalSigners = 3;
    } else if (index === 1) {
      requiredSignatures = 3;
      totalSigners = 5;
    } else if (index === 2) {
      requiredSignatures = 5;
      totalSigners = 5;
    } else {
      requiredSignatures = Math.min(index + 1, 5);
      totalSigners = Math.min(index + 3, 7);
    }
    
    return {
      ...wallet,
      requiredSignatures,
      totalSigners,
      signers: Array.from({ length: totalSigners }, (_, i) => ({
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        name: i === 0 ? 'You' : i === 1 ? 'AI Assistant' : `Co-signer ${i}`,
        hasSigned: i === 0 // Current user has already signed
      }))
    };
  });
  
  // Set up pending approvals
  useEffect(() => {
    if (isConnected) {
      // For demonstration purposes, set a fixed number
      setPendingApprovals(3);
    } else {
      setPendingApprovals(0);
    }
  }, [isConnected]);
  
  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Alert management
  const addAlert = (alert: Omit<AlertMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts(prev => [...prev, { ...alert, id }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };
  
  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  const value: WalletContextType = {
    address,
    isConnected,
    mounted,
    chainId,
    totalBalance,
    relatedMultisigWallets,
    selectedMultisigWalletAddress,
    isLoadingWallets,
    walletsError,
    pendingApprovals,
    alerts,
    setSelectedMultisigWalletAddress,
    handleCreateMultisig,
    refetchWallets,
    updateTotalBalance,
    addAlert,
    removeAlert,
  };
  
    return (
        <WalletContext.Provider value={value}>
          {children}
        </WalletContext.Provider>
    );
};

// Hook to use wallet context
export const useWalletContext = () => useContext(WalletContext);


// Example export of mockDAppsList
export const mockDAppsList = [
    {
      id: '1',
      name: 'Uniswap',
      url: 'https://app.uniswap.org',
      description: 'A decentralized trading protocol',
      categories: ['defi', 'exchange'],
      logo: 'https://example.com/uniswap-logo.png',
      bookmarked: true,
    },
    {
      id: '2',
      name: 'Aave',
      url: 'https://aave.com',
      description: 'An open-source liquidity protocol',
      categories: ['defi', 'lending'],
      logo: 'https://example.com/aave-logo.png',
      bookmarked: false,
    },
  ];