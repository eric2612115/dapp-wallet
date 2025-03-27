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
  const relatedMultisigWallets: ExtendedMultisigWallet[] = baseMultisigWallets.map((wallet, index) => ({
    ...wallet,
    requiredSignatures: wallet.name.includes('2/3') ? 2 : wallet.name.includes('3/5') ? 3 : 2,
    totalSigners: wallet.name.includes('2/3') ? 3 : wallet.name.includes('3/5') ? 5 : 2,
    signers: [
      { address: address || '', name: 'You', hasSigned: true },
      { address: `0x${Math.random().toString(16).substring(2, 42)}`, name: 'AI Assistant', hasSigned: index % 2 === 0 },
      { address: `0x${Math.random().toString(16).substring(2, 42)}`, name: 'Co-signer 3', hasSigned: index % 3 === 0 },
    ].slice(0, wallet.name.includes('3/5') ? 5 : wallet.name.includes('2/3') ? 3 : 2),
  }));
  
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
  
  const value = {
    address,
    isConnected,
    mounted,
    chainId,
    totalBalance,
    relatedMultisigWallets,
    selectedMultisigWalletAddress,
    isLoadingWallets,
    walletsError,
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