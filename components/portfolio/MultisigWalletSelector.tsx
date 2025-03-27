// components/portfolio/MultisigWalletSelector.tsx
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import type { MultisigWallet } from '@/types/assets';

interface MultisigWalletSelectorProps {
  isLoadingWallets: boolean;
  walletsError: Error | null;
  relatedMultisigWallets: MultisigWallet[];
  selectedMultisigWalletAddress: string;
  handleMultisigWalletChange: (walletAddress: string) => void;
}

const MultisigWalletSelector: React.FC<MultisigWalletSelectorProps> = ({
  isLoadingWallets,
  walletsError,
  relatedMultisigWallets,
  selectedMultisigWalletAddress,
  handleMultisigWalletChange
}) => {
  return (
    <div className="mb-6">
      {isLoadingWallets ? (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
      ) : relatedMultisigWallets.length === 0 ? (
        <Alert variant="info" className="mb-4">
          <AlertDescription>
            No multi-signature wallets found. Create one to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Select wallet:
          </label>
          <select
            value={selectedMultisigWalletAddress}
            onChange={(e) => handleMultisigWalletChange(e.target.value)}
            className="block w-full max-w-md pl-3 pr-10 py-2 text-base border-gray-300 dark:border-dark-100 focus:outline-none focus:ring-clay-500 dark:focus:ring-clay-400 focus:border-clay-500 dark:focus:border-clay-400 sm:text-sm rounded-md bg-white dark:bg-dark-300 text-gray-700 dark:text-gray-200"
          >
            {relatedMultisigWallets.map((wallet) => (
              <option key={wallet.multisig_address} value={wallet.multisig_address}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default MultisigWalletSelector;