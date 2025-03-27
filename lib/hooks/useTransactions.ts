// hooks/useTransactions.ts
import { useState, useCallback } from 'react';
import { useChainId } from 'wagmi';
import { WalletService } from '@/lib/mockServices';
import type { Transaction } from '@/types/transactions';

export function useTransactions(
  address: string,
  walletType: 'personal' | 'multisig',
  selectedMultisigWalletAddress: string = ''
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const chainId = useChainId();
  
  const fetchTransactions = useCallback(async (addr: string) => {
    if (!addr) return;
    
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
      walletTransactions.forEach((tx: { hash: string; type: string; timestamp: string }) => {
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
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  }, [chainId]);
  
  // Helper to get the appropriate wallet address
  const getWalletAddress = useCallback(() => {
    return walletType === 'personal' ? address : selectedMultisigWalletAddress;
  }, [address, walletType, selectedMultisigWalletAddress]);
  
  return {
    transactions,
    loadingTransactions,
    fetchTransactions,
    getWalletAddress
  };
}