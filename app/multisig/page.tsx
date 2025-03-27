'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletProvider, useWalletContext } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { Tabs, TabList, TabTrigger } from '@/components/ui/Tabs';
import { Plus as PlusIcon, Users as UsersIcon } from 'lucide-react';
import SignatureStatus from '@/components/multisig/SignatureStatus';
import AlertContainer from '@/components/shared/AlertContainer';
import Badge from '@/components/ui/Badge';

// Main container component with provider
const MultisigPage = () => {
  return (
    <WalletProvider>
      <MultisigDashboard />
      <AlertContainer />
    </WalletProvider>
  );
};

// Main dashboard component using wallet context
const MultisigDashboard = () => {
  const { isConnected, mounted, relatedMultisigWallets, addAlert } = useWalletContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('wallets');
  
  // Show nothing when not mounted (to prevent hydration issues)
  if (!mounted) {
    return null;
  }
  
  if (!isConnected) {
    return (
      <div className="text-center py-8 flex flex-col items-center justify-center bg-warm-paper dark:bg-dark-200 rounded-lg border border-warm-divider dark:border-dark-100">
        <div className="bg-warm-bg dark:bg-warm-primary/30 text-warm-primary dark:text-warm-secondary w-16 h-16 flex items-center justify-center rounded-full mb-2">
          <UsersIcon size={32} />
        </div>
        <h2 className="text-xl font-semibold text-warm-text dark:text-white mb-2">
          Please connect your wallet to manage multi-signature wallets
        </h2>
        <p className="text-warm-textSecondary dark:text-gray-400 max-w-md mb-6">
          Connect your wallet to view and manage your multi-signature wallets, co-signers, and approval policies.
        </p>
      </div>
    );
  }
  
  // Mock pending transactions
  const pendingTransactions = [
    {
      id: 'tx1',
      type: 'Withdrawal',
      asset: 'ETH',
      amount: '1.5',
      value: '$5,250',
      wallet: relatedMultisigWallets[0]?.name || 'Multi-sig Wallet 1',
      walletAddress: relatedMultisigWallets[0]?.multisig_address || '',
      requiredSignatures: 2,
      totalSigners: 3,
      signers: [
        { address: '0x123...', name: 'You', hasSigned: true },
        { address: '0x456...', name: 'AI Assistant', hasSigned: false },
        { address: '0x789...', name: 'Co-signer 3', hasSigned: false },
      ],
      createdAt: '2025-03-26T14:30:00Z'
    },
    {
      id: 'tx2',
      type: 'Whitelist Token',
      asset: 'USDC',
      amount: '',
      value: '',
      wallet: relatedMultisigWallets[0]?.name || 'Multi-sig Wallet 1',
      walletAddress: relatedMultisigWallets[0]?.multisig_address || '',
      requiredSignatures: 2,
      totalSigners: 3,
      signers: [
        { address: '0x123...', name: 'You', hasSigned: true },
        { address: '0x456...', name: 'AI Assistant', hasSigned: true },
        { address: '0x789...', name: 'Co-signer 3', hasSigned: false },
      ],
      createdAt: '2025-03-25T10:15:00Z'
    }
  ];
  
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
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warm-text dark:text-white">
            Multi-signature Wallet Management
          </h1>
          <p className="text-warm-textSecondary dark:text-gray-300">
            Manage your multi-signature wallets, co-signers, and approval policies
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary"
            startIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => router.push('/multisig/create')}
          >
            Create New Wallet
          </Button>
        </div>
      </div>
      
      <Tabs className="mb-6">
        <TabList>
          <TabTrigger
            value="wallets"
            isActive={activeTab === 'wallets'}
            onClick={() => setActiveTab('wallets')}
          >
            MY WALLETS
          </TabTrigger>
          <TabTrigger
            value="pending"
            isActive={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
          >
            PENDING APPROVALS
          </TabTrigger>
          <TabTrigger
            value="whitelist"
            isActive={activeTab === 'whitelist'}
            onClick={() => setActiveTab('whitelist')}
          >
            WHITELIST MANAGEMENT
          </TabTrigger>
        </TabList>
      </Tabs>
      
      {/* Wallets Tab */}
      {activeTab === 'wallets' && (
        <Card>
          <CardHeader>
            <CardTitle>My Multi-signature Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            {relatedMultisigWallets.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-warm-textSecondary dark:text-gray-400 mb-4">
                  You don&apos;t have any multi-signature wallets yet.
                </p>
                <Button 
                  variant="primary"
                  onClick={() => router.push('/multisig/create')}
                >
                  Create Your First Wallet
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead>Signatures</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedMultisigWallets.map((wallet) => (
                    <TableRow key={wallet.multisig_address}>
                      <TableCell>
                        <div className="font-medium">{wallet.name}</div>
                      </TableCell>
                      <TableCell>
                        {wallet.multisig_address.slice(0, 6)}...{wallet.multisig_address.slice(-4)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{wallet.chain}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">{wallet.requiredSignatures}/{wallet.totalSigners}</span>
                          <span className="ml-2 text-xs text-warm-textSecondary dark:text-gray-400">
                            signatures required
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => router.push('/')}
                          >
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push('/multisig/policies')}
                          >
                            Policies
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Pending Approvals Tab */}
      {activeTab === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTransactions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-warm-textSecondary dark:text-gray-400">
                  No pending transactions require your approval.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Signature Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Badge 
                          variant={tx.type === 'Withdrawal' ? 'danger' : 'info'}
                        >
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {tx.type === 'Withdrawal' 
                            ? `${tx.amount} ${tx.asset} (${tx.value})` 
                            : `${tx.asset} Token`}
                        </div>
                        <div className="text-xs text-warm-textSecondary dark:text-gray-400">
                          ID: {tx.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{tx.wallet}</div>
                        <div className="text-xs text-warm-textSecondary dark:text-gray-400">
                          {tx.walletAddress.slice(0, 6)}...{tx.walletAddress.slice(-4)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(tx.createdAt)}
                      </TableCell>
                      <TableCell>
                        <SignatureStatus
                          requiredSignatures={tx.requiredSignatures}
                          totalSigners={tx.totalSigners}
                          signers={tx.signers}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="primary" 
                            size="sm"
                            disabled={tx.signers.find(s => s.name === 'You')?.hasSigned}
                            onClick={() => {
                              addAlert({
                                type: 'success',
                                title: 'Success',
                                message: `You approved the ${tx.type.toLowerCase()} transaction`
                              });
                            }}
                          >
                            {tx.signers.find(s => s.name === 'You')?.hasSigned ? 'Approved' : 'Approve'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Whitelist Management Tab */}
      {activeTab === 'whitelist' && (
        <Card>
          <CardHeader>
            <CardTitle>Whitelist Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-warm-textSecondary dark:text-gray-400">
                Manage whitelisted tokens that can be transferred with simplified approval processes.
              </p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Ethereum (ETH)</div>
                  </TableCell>
                  <TableCell>0xC02...Cc2</TableCell>
                  <TableCell>
                    {relatedMultisigWallets[0]?.name || 'Multi-sig Wallet 1'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Whitelisted</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        addAlert({
                          type: 'warning',
                          title: 'Confirmation Required',
                          message: 'Removing ETH from whitelist will require full approval process for future transfers'
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">USD Coin (USDC)</div>
                  </TableCell>
                  <TableCell>0xA0b...eB48</TableCell>
                  <TableCell>
                    {relatedMultisigWallets[0]?.name || 'Multi-sig Wallet 1'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending Approval</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          addAlert({
                            type: 'success',
                            title: 'Success',
                            message: 'You approved adding USDC to the whitelist'
                          });
                        }}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          addAlert({
                            type: 'info',
                            title: 'Cancelled',
                            message: 'Request cancelled'
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="primary"
                startIcon={<PlusIcon className="w-4 h-4" />}
                onClick={() => {
                  addAlert({
                    type: 'info',
                    title: 'Whitelist Request',
                    message: 'Token whitelist request has been initiated. Other signers need to approve.'
                  });
                }}
              >
                Add New Token
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultisigPage;