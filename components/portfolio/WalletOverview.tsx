// components/portfolio/WalletOverview.tsx
import React, { useState } from 'react';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// Wallet type definition
export interface Wallet {
  address: string;
  totalValue: number;
  change24h: number;
}

interface WalletOverviewProps {
  wallet: Wallet;
  onDeposit: () => void;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ wallet, onDeposit }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyAddress = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Wallet Overview
          </h3>
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {wallet.address.slice(0, 10)}...{wallet.address.slice(-4)}
            </p>
            <button
              onClick={() => copyAddress(wallet.address)}
              className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={copiedAddress ? "Copied" : "Copy address"}
            >
              {copiedAddress ? (
                <CheckIcon fontSize="small" className="text-green-500" />
              ) : (
                <CopyIcon fontSize="small" />
              )}
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            ${wallet.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          <Badge variant="success" className="mt-1">
            ▲ {wallet.change24h}% today
          </Badge>
        </div>
      </CardHeader>
      
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
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;