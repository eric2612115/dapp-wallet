// components/shared/ApprovalSidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SignatureStatus from '@/components/multisig/SignatureStatus';
import { X as CloseIcon, CheckCircle2 as CheckIcon, XCircle as RejectIcon } from 'lucide-react';

type ApprovalTab = 'pending' | 'history';

interface Transaction {
  id: string;
  type: string;
  asset?: string;
  amount?: string;
  value?: string;
  wallet: string;
  walletAddress: string;
  requiredSignatures: number;
  totalSigners: number;
  signers: Array<{
    address: string;
    name?: string;
    hasSigned?: boolean;
  }>;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  metadata?: {
    tokenAddress?: string;
    dapp?: string;
    action?: string;
    url?: string;
    policyChanges?: string;
  };
}

interface ApprovalSidebarProps {
  open: boolean;
  onClose: () => void;
}

const ApprovalSidebar: React.FC<ApprovalSidebarProps> = ({ open, onClose }) => {
  const { addAlert } = useWalletContext();
  const [activeTab, setActiveTab] = useState<ApprovalTab>('pending');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Mock transactions data
  useEffect(() => {
    // For demo purposes, we'll simulate fetching transactions
    const pendingTransactions: Transaction[] = [
      {
        id: 'tx1',
        type: 'Withdrawal',
        asset: 'ETH',
        amount: '1.5',
        value: '$5,250',
        wallet: 'Treasury Wallet',
        walletAddress: '0x1234567890123456789012345678901234567890',
        requiredSignatures: 2,
        totalSigners: 3,
        signers: [
          { address: '0x123...', name: 'You', hasSigned: true },
          { address: '0x456...', name: 'AI Assistant', hasSigned: false },
          { address: '0x789...', name: 'Co-signer 3', hasSigned: false },
        ],
        createdAt: '2025-03-26T14:30:00Z',
        status: 'pending'
      },
      {
        id: 'tx2',
        type: 'Whitelist Token',
        asset: 'USDC',
        wallet: 'DAO Multisig',
        walletAddress: '0x0987654321098765432109876543210987654321',
        requiredSignatures: 2,
        totalSigners: 3,
        signers: [
          { address: '0x123...', name: 'You', hasSigned: true },
          { address: '0x456...', name: 'AI Assistant', hasSigned: true },
          { address: '0x789...', name: 'Co-signer 3', hasSigned: false },
        ],
        createdAt: '2025-03-25T10:15:00Z',
        status: 'pending',
        metadata: {
          tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        }
      },
      {
        id: 'tx3',
        type: 'DApp Interaction',
        wallet: 'Treasury Wallet',
        walletAddress: '0x1234567890123456789012345678901234567890',
        requiredSignatures: 3,
        totalSigners: 5,
        signers: [
          { address: '0x123...', name: 'You', hasSigned: false },
          { address: '0x456...', name: 'AI Assistant', hasSigned: true },
          { address: '0x789...', name: 'Co-signer 3', hasSigned: true },
          { address: '0xabc...', name: 'Co-signer 4', hasSigned: false },
          { address: '0xdef...', name: 'Co-signer 5', hasSigned: false },
        ],
        createdAt: '2025-03-24T16:45:00Z',
        status: 'pending',
        metadata: {
          dapp: 'Uniswap',
          action: 'Swap 50 ETH for USDC',
          url: 'https://app.uniswap.org'
        }
      }
    ];

    const historyTransactions: Transaction[] = [
      {
        id: 'tx4',
        type: 'Transfer',
        asset: 'LINK',
        amount: '100',
        value: '$1,500',
        wallet: 'DAO Multisig',
        walletAddress: '0x0987654321098765432109876543210987654321',
        requiredSignatures: 2,
        totalSigners: 3,
        signers: [
          { address: '0x123...', name: 'You', hasSigned: true },
          { address: '0x456...', name: 'AI Assistant', hasSigned: true },
          { address: '0x789...', name: 'Co-signer 3', hasSigned: false },
        ],
        createdAt: '2025-03-20T09:30:00Z',
        status: 'executed'
      },
      {
        id: 'tx5',
        type: 'Policy Update',
        wallet: 'Treasury Wallet',
        walletAddress: '0x1234567890123456789012345678901234567890',
        requiredSignatures: 3,
        totalSigners: 5,
        signers: [
          { address: '0x123...', name: 'You', hasSigned: true },
          { address: '0x456...', name: 'AI Assistant', hasSigned: true },
          { address: '0x789...', name: 'Co-signer 3', hasSigned: true },
          { address: '0xabc...', name: 'Co-signer 4', hasSigned: false },
          { address: '0xdef...', name: 'Co-signer 5', hasSigned: false },
        ],
        createdAt: '2025-03-18T14:15:00Z',
        status: 'executed',
        metadata: {
          policyChanges: 'Updated whitelist token transfer requirement from 2 to 1 signature'
        }
      },
      {
        id: 'tx6',
        type: 'Withdrawal',
        asset: 'BTC',
        amount: '0.25',
        value: '$16,250',
        wallet: 'Treasury Wallet',
        walletAddress: '0x1234567890123456789012345678901234567890',
        requiredSignatures: 3,
        totalSigners: 5,
        signers: [
          { address: '0x123...', name: 'You', hasSigned: true },
          { address: '0x456...', name: 'AI Assistant', hasSigned: false },
          { address: '0x789...', name: 'Co-signer 3', hasSigned: false },
          { address: '0xabc...', name: 'Co-signer 4', hasSigned: false },
          { address: '0xdef...', name: 'Co-signer 5', hasSigned: false },
        ],
        createdAt: '2025-03-15T11:45:00Z',
        status: 'rejected'
      }
    ];

    setTransactions([...pendingTransactions, ...historyTransactions]);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(tx => 
    activeTab === 'pending' ? tx.status === 'pending' : tx.status !== 'pending'
  );

  // Handle approve transaction
  const handleApprove = (txId: string) => {
    setActionLoading(prev => ({ ...prev, [txId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      // Update transaction in state
      setTransactions(prev => 
        prev.map(tx => {
          if (tx.id === txId) {
            const updatedSigners = tx.signers.map(signer => 
              signer.name === 'You' ? { ...signer, hasSigned: true } : signer
            );
            
            // Count signed
            const signedCount = updatedSigners.filter(s => s.hasSigned).length;
            
            // Check if enough signatures to execute
            const newStatus = signedCount >= tx.requiredSignatures ? 'executed' : 'pending';
            
            return { 
              ...tx, 
              signers: updatedSigners,
              status: newStatus
            };
          }
          return tx;
        })
      );
      
      setActionLoading(prev => ({ ...prev, [txId]: false }));
      
      addAlert({
        type: 'success',
        title: 'Transaction Approved',
        message: 'Your approval has been recorded successfully.'
      });
    }, 1500);
  };

  // Handle reject transaction
  const handleReject = (txId: string) => {
    setActionLoading(prev => ({ ...prev, [txId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      // Update transaction in state
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === txId ? { ...tx, status: 'rejected' } : tx
        )
      );
      
      setActionLoading(prev => ({ ...prev, [txId]: false }));
      
      addAlert({
        type: 'info',
        title: 'Transaction Rejected',
        message: 'You have rejected this transaction.'
      });
    }, 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative h-full w-full max-w-md bg-warm-paper dark:bg-dark-200 shadow-xl flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-warm-divider dark:border-dark-100 flex items-center justify-between">
          <h2 className="text-lg font-medium text-warm-text dark:text-white">Multisig Approvals</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-warm-bg dark:hover:bg-dark-100 text-warm-textSecondary dark:text-gray-400"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-warm-divider dark:border-dark-100">
          <button
            className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${
              activeTab === 'pending' 
                ? 'text-warm-primary dark:text-warm-primary border-b-2 border-warm-primary' 
                : 'text-warm-textSecondary dark:text-gray-400 hover:text-warm-text dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approvals
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-warm-primary text-white inline-flex justify-center items-center min-w-5">
              {transactions.filter(tx => tx.status === 'pending').length}
            </span>
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${
              activeTab === 'history' 
                ? 'text-warm-primary dark:text-warm-primary border-b-2 border-warm-primary' 
                : 'text-warm-textSecondary dark:text-gray-400 hover:text-warm-text dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Transaction History
          </button>
        </div>
        
        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-warm-textSecondary dark:text-gray-400">
              {activeTab === 'pending' 
                ? 'No pending transactions require your approval' 
                : 'No transaction history available'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map(tx => (
                <div 
                  key={tx.id}
                  className="bg-warm-bg dark:bg-dark-100 rounded-lg overflow-hidden border border-warm-divider dark:border-dark-100"
                >
                  {/* Header */}
                  <div className="p-3 flex justify-between items-center bg-warm-bg/80 dark:bg-dark-100/80 border-b border-warm-divider dark:border-dark-100">
                    <div className="flex items-center">
                      <Badge 
                        variant={
                          tx.type === 'Withdrawal' ? 'danger' : 
                          tx.type === 'Transfer' ? 'primary' :
                          tx.type === 'Whitelist Token' ? 'info' :
                          tx.type === 'Policy Update' ? 'warning' :
                          tx.type === 'DApp Interaction' ? 'secondary' : 'default'
                        }
                      >
                        {tx.type}
                      </Badge>
                      <span className="ml-2 text-xs text-warm-textSecondary dark:text-gray-400">
                        {formatDate(tx.createdAt)}
                      </span>
                    </div>
                    <Badge 
                      variant={
                        tx.status === 'pending' ? 'warning' :
                        tx.status === 'executed' ? 'success' :
                        tx.status === 'rejected' ? 'danger' : 'default'
                      }
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <div className="mb-2">
                      <p className="font-medium text-warm-text dark:text-white">
                        {tx.asset ? `${tx.amount} ${tx.asset}` : tx.metadata?.action || tx.type}
                        {tx.value && ` (${tx.value})`}
                      </p>
                      <p className="text-sm text-warm-textSecondary dark:text-gray-400">
                        From: {tx.wallet}
                      </p>
                      
                      {/* Metadata specific UI */}
                      {tx.metadata?.dapp && (
                        <div className="mt-2 p-2 bg-warm-paper dark:bg-dark-200 rounded text-sm">
                          <p className="font-medium text-warm-text dark:text-white">
                            DApp: {tx.metadata.dapp}
                          </p>
                          {tx.metadata.url && (
                            <p className="text-xs text-warm-primary dark:text-warm-primary truncate">
                              {tx.metadata.url}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {tx.metadata?.policyChanges && (
                        <div className="mt-2 p-2 bg-warm-paper dark:bg-dark-200 rounded text-sm">
                          <p className="text-warm-text dark:text-white">
                            {tx.metadata.policyChanges}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Signature Status */}
                    <div className="mt-3">
                      <SignatureStatus
                        requiredSignatures={tx.requiredSignatures}
                        totalSigners={tx.totalSigners}
                        signers={tx.signers}
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    {tx.status === 'pending' && activeTab === 'pending' && !tx.signers.find(s => s.name === 'You')?.hasSigned && (
                      <div className="mt-3 flex space-x-2">
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(tx.id)}
                          isLoading={actionLoading[tx.id]}
                          disabled={actionLoading[tx.id]}
                          fullWidth
                          startIcon={<CheckIcon className="w-4 h-4" />}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(tx.id)}
                          disabled={actionLoading[tx.id]}
                          fullWidth
                          startIcon={<RejectIcon className="w-4 h-4" />}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {tx.status === 'pending' && activeTab === 'pending' && tx.signers.find(s => s.name === 'You')?.hasSigned && (
                      <div className="mt-3">
                        <Button
                          variant="default"
                          fullWidth
                          disabled
                        >
                          Awaiting Other Signatures
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalSidebar;