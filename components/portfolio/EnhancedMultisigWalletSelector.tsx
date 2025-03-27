'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ExtendedMultisigWallet } from '@/contexts/WalletContext';
import { Settings as SettingsIcon, Plus as PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EnhancedMultisigWalletSelectorProps {
  isLoadingWallets: boolean;
  walletsError: Error | null;
  wallets: ExtendedMultisigWallet[];
  selectedWalletAddress: string;
  onChange: (walletAddress: string) => void;
  onCreateNew?: () => void;
}

const EnhancedMultisigWalletSelector: React.FC<EnhancedMultisigWalletSelectorProps> = ({
  isLoadingWallets,
  walletsError,
  wallets,
  selectedWalletAddress,
  onChange,
  onCreateNew,
}) => {
  const router = useRouter();
  
  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      router.push('/multisig/create');
    }
  };
  
  const handleManageWallets = () => {
    router.push('/multisig');
  };
  
  const walletOptions = wallets.map(wallet => ({
    value: wallet.multisig_address,
    label: `${wallet.name} (${wallet.requiredSignatures}/${wallet.totalSigners} signatures)`
  }));

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-grow">
            <h3 className="text-base font-medium text-warm-text dark:text-white mb-2">Multi-Signature Wallet</h3>
            
            {isLoadingWallets ? (
              <div className="flex items-center gap-2 text-warm-textSecondary dark:text-gray-400">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading wallets...</span>
              </div>
            ) : walletsError ? (
              <Alert variant="error" className="mb-4">
                <AlertDescription>
                  Error loading multi-signature wallets. Please try again.
                </AlertDescription>
              </Alert>
            ) : wallets.length === 0 ? (
              <Alert variant="info" className="mb-4">
                <AlertDescription>
                  No multi-signature wallets found. Create one to get started.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="w-full">
                <Select
                  options={walletOptions}
                  value={selectedWalletAddress}
                  onChange={onChange}
                  placeholder="Select a multi-signature wallet"
                  fullWidth
                />
                {selectedWalletAddress && (
                  <div className="mt-2 text-sm text-warm-textSecondary dark:text-gray-400">
                    Address: {selectedWalletAddress.slice(0, 6)}...{selectedWalletAddress.slice(-4)}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="default"
              size="md"
              startIcon={<SettingsIcon className="w-4 h-4" />}
              onClick={handleManageWallets}
              fullWidth
              className="md:flex-nowrap"
            >
              Manage Wallets
            </Button>
            <Button
              variant="primary"
              size="md"
              startIcon={<PlusIcon className="w-4 h-4" />}
              onClick={handleCreateNew}
              fullWidth
              className="md:flex-nowrap"
            >
              Create New
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMultisigWalletSelector;