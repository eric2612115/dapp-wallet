// components/portfolio/QuickTransferCard.tsx
import React, { useState } from 'react';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';

// Available tokens interface
interface TokenInfo {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  tokenAddress?: string;
  decimals?: number;
  chain: string;
  chainId: number;
}

// Multisig wallet interface
interface MultisigWallet {
  name: string;
  multisig_address: string;
  chain: string;
  chainId: number;
}

interface QuickTransferCardProps {
  userWalletAddress: string;
  userWalletName?: string;
  totalBalance: number;
  availableTokens: TokenInfo[];
  relatedWallets: MultisigWallet[];
  onTransfer: (data: { token: string; amount: string; recipient: string }) => void;
  onCreateMultisig?: () => void;
  isLoadingWallets?: boolean;
}

const QuickTransferCard: React.FC<QuickTransferCardProps> = ({
  userWalletAddress,
  userWalletName = 'My Personal Wallet',
  totalBalance,
  availableTokens,
  relatedWallets,
  onTransfer,
  onCreateMultisig
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // Format wallet addresses for display
  const formatAddress = (address: string): string => {
    if (!address || address.length < 8) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle submit
  const handleSubmit = () => {
    if (selectedRecipient && selectedToken && transferAmount) {
      onTransfer({
        token: selectedToken,
        amount: transferAmount,
        recipient: selectedRecipient
      });
      setTransferAmount('');
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-warm-divider dark:divide-dark-100">
          {/* Left side - Sender */}
          <div className="p-6 md:col-span-2 bg-warm-bg dark:bg-dark-200">
            <h3 className="text-sm font-medium text-warm-textSecondary dark:text-gray-400 mb-3">From</h3>
            
            <div className="flex items-center mb-4">
              <Avatar 
                initials="D" 
                size="md"
                className="bg-warm-primary/20 dark:bg-warm-primary/30 text-warm-primary dark:text-warm-secondary mr-3"
              />
              <div>
                <p className="font-medium text-warm-text dark:text-white">{userWalletName}</p>
                <p className="text-xs text-warm-textSecondary dark:text-gray-400">{formatAddress(userWalletAddress)}</p>
              </div>
            </div>
            
            <div className="bg-warm-paper dark:bg-dark-100 border border-warm-divider dark:border-dark-100 rounded-md p-3 mb-4">
              <p className="text-xs text-warm-textSecondary dark:text-gray-400">Total Balance</p>
              <p className="text-xl font-semibold text-warm-text dark:text-white">${totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
            
            <div className="space-y-3">
              <select 
                className="w-full py-2 px-3 border border-warm-divider dark:border-dark-100 bg-warm-paper dark:bg-dark-300 rounded-md shadow-sm text-warm-text dark:text-gray-200"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
              >
                <option value="">Select a token</option>
                {availableTokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - Balance: {token.balance}
                  </option>
                ))}
              </select>
              
              <Input
                type="number"
                placeholder="Amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                disabled={!selectedToken}
                fullWidth
              />
            </div>
          </div>
          
          {/* Arrow for desktop */}
          <div className="hidden md:flex md:col-span-1 items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-warm-bg dark:bg-dark-100 flex items-center justify-center text-warm-primary dark:text-warm-secondary">
              <ArrowForwardIcon />
            </div>
          </div>
          
          {/* Right side - Recipient */}
          <div className="p-6 md:col-span-2 bg-warm-paper dark:bg-dark-200">
            <h3 className="text-sm font-medium text-warm-textSecondary dark:text-gray-400 mb-3">To</h3>
            
            {relatedWallets.length === 0 ? (
              <div className="text-center p-6 border border-yellow-300/50 dark:border-yellow-900/30 rounded-md bg-yellow-50/50 dark:bg-yellow-900/10">
                <p className="text-sm text-yellow-700 dark:text-yellow-500 mb-3">
                  No related wallets found. You need to create a multi-signature wallet first.
                </p>
                <Button
                  onClick={onCreateMultisig}
                  variant="default"
                  startIcon={<span>+</span>}
                >
                  New Multi-sig Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {relatedWallets.map((wallet) => (
                  <div
                    key={wallet.multisig_address}
                    onClick={() => setSelectedRecipient(wallet.multisig_address)}
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      selectedRecipient === wallet.multisig_address
                        ? 'border-warm-primary dark:border-warm-primary/80 bg-warm-primary/10 dark:bg-warm-primary/20'
                        : 'border-warm-divider dark:border-dark-100 hover:border-warm-divider/70 dark:hover:border-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedRecipient === wallet.multisig_address}
                      onChange={() => setSelectedRecipient(wallet.multisig_address)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-warm-text dark:text-white">{wallet.name}</p>
                      <p className="text-xs text-warm-textSecondary dark:text-gray-400">
                        {wallet.chain} - {formatAddress(wallet.multisig_address)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!selectedRecipient || !selectedToken || !transferAmount || relatedWallets.length === 0}
                variant="default"
                startIcon={<ArrowForwardIcon />}
              >
                TRANSFER
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickTransferCard;