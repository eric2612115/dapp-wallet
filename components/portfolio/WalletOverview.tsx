'use client';

import React, { useState } from 'react';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SignatureStatus from '@/components/multisig/SignatureStatus';
import { ExtendedMultisigWallet } from '@/contexts/WalletContext';

// Wallet type definition
export interface Wallet {
  address: string;
  totalValue: number;
  change24h: number;
}

interface WalletOverviewProps {
  wallet: Wallet;
  onDeposit: () => void;
  isMultisig?: boolean;
  multisigInfo?: ExtendedMultisigWallet;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ 
  wallet, 
  onDeposit, 
  isMultisig = false,
  multisigInfo
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyAddress = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-warm-text dark:text-white">
            {isMultisig ? multisigInfo?.name || 'Multi-signature Wallet' : 'Personal Wallet'}
          </h3>
          <div className="flex items-center">
            <p className="text-sm text-warm-textSecondary dark:text-gray-300">
              {wallet.address.slice(0, 10)}...{wallet.address.slice(-4)}
            </p>
            <button
              onClick={() => copyAddress(wallet.address)}
              className="ml-1 text-warm-textSecondary hover:text-warm-text dark:hover:text-gray-200"
              aria-label={copiedAddress ? "Copied" : "Copy address"}
            >
              {copiedAddress ? (
                <CheckIcon fontSize="small" className="text-green-500" />
              ) : (
                <CopyIcon fontSize="small" />
              )}
            </button>
          </div>
          
          {/* Multi-sig specific info */}
          {isMultisig && multisigInfo && (
            <div className="mt-2 flex items-center">
              <Badge variant="primary" className="mr-2">
                {multisigInfo.requiredSignatures}/{multisigInfo.totalSigners} Signatures
              </Badge>
              <Badge variant="secondary">
                {multisigInfo.chain}
              </Badge>
            </div>
          )}
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <p className="text-2xl font-semibold text-warm-text dark:text-white">
            ${wallet.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          <Badge variant={wallet.change24h >= 0 ? "success" : "danger"} className="mt-1">
            {wallet.change24h >= 0 ? '▲' : '▼'} {Math.abs(wallet.change24h)}% today
          </Badge>
        </div>
      </CardHeader>
      
      {isMultisig && multisigInfo && (
        <div className="px-6 pb-2 pt-0">
          <div className="p-3 bg-warm-bg dark:bg-dark-100 rounded-md">
            <SignatureStatus
              requiredSignatures={multisigInfo.requiredSignatures}
              totalSigners={multisigInfo.totalSigners}
              signers={multisigInfo.signers}
            />
          </div>
        </div>
      )}
      
      <CardContent>
        <div className="flex justify-center gap-3">
          <Button variant="default" fullWidth>
            <span className="mr-2">→</span> SEND
          </Button>
          <Button variant="default" fullWidth>
            <span className="mr-2">↔</span> SWAP
          </Button>
          <Button 
            onClick={onDeposit}
            variant="primary" 
            fullWidth
          >
            <span className="mr-2">+</span> DEPOSIT
          </Button>
          
          {isMultisig && (
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/multisig/policies'}
            >
              <span className="mr-2">⚙️</span> POLICIES
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;