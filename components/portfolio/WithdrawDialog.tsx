'use client';

import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import SignatureStatus from '@/components/multisig/SignatureStatus';
import { Asset } from '@/types/assets';

interface WithdrawDialogProps {
  open: boolean;
  asset: Asset | null;
  walletName: string;
  requiredSignatures: number;
  totalSigners: number;
  signers: Array<{
    address: string;
    hasSigned?: boolean;
    name?: string;
  }>;
  onClose: () => void;
  onSubmit: (token: string, amount: string) => void;
}

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
  open,
  asset,
  walletName,
  requiredSignatures,
  totalSigners,
  signers,
  onClose,
  onSubmit
}) => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Set initial amount to full balance when dialog opens or asset changes
  React.useEffect(() => {
    if (asset && open) {
      setAmount(asset.balance.toString());
    } else {
      setAmount('');
    }
  }, [asset, open]);
  
  const handleSubmit = () => {
    if (!asset || !amount) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSubmit(asset.symbol, amount);
      setLoading(false);
    }, 1500);
  };
  
  if (!asset) return null;
  
  return (
    <Modal
      isOpen={open}
      onClose={loading ? () => {} : onClose}
      title={`Withdraw ${asset.symbol} from ${walletName}`}
      maxWidth="md"
    >
      <ModalBody>
        <div className="mb-6">
          <p className="text-warm-textSecondary dark:text-gray-400 mb-2">Available Balance:</p>
          <div className="flex items-center justify-between p-3 bg-warm-bg dark:bg-dark-100 rounded-md">
            <div className="flex items-center">
              {asset.logoUrl && (
                <img 
                  src={asset.logoUrl} 
                  alt={asset.symbol} 
                  className="w-8 h-8 mr-3"
                />
              )}
              <div>
                <p className="font-medium text-warm-text dark:text-white">{asset.name}</p>
                <p className="text-sm text-warm-textSecondary dark:text-gray-400">{asset.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-warm-text dark:text-white">
                {asset.balance.toLocaleString()} {asset.symbol}
              </p>
              <p className="text-sm text-warm-textSecondary dark:text-gray-400">
                ${asset.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-warm-text dark:text-white mb-2">
            Withdraw Amount
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={asset.balance}
              className="flex-1 p-2 border border-warm-divider dark:border-dark-100 rounded-l-md bg-warm-paper dark:bg-dark-300 text-warm-text dark:text-white"
              disabled={loading}
            />
            <button 
              className="px-3 py-2 bg-warm-bg dark:bg-dark-200 border border-l-0 border-warm-divider dark:border-dark-100 rounded-r-md text-warm-primary"
              onClick={() => setAmount(asset.balance.toString())}
              disabled={loading}
            >
              MAX
            </button>
          </div>
          <p className="mt-1 text-sm text-warm-textSecondary dark:text-gray-400">
            Value: ${(parseFloat(amount || '0') * asset.price).toLocaleString()}
          </p>
        </div>
        
        {/* Withdrawal policy notice */}
        <div className="mb-6">
          <Alert variant="info">
            <AlertDescription>
              This withdrawal requires {requiredSignatures} out of {totalSigners} signatures to be executed. All signers will be notified to review and approve this transaction.
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Signature status */}
        <div className="mb-6">
          <p className="text-sm font-medium text-warm-text dark:text-white mb-2">Signature Status:</p>
          <SignatureStatus
            requiredSignatures={requiredSignatures}
            totalSigners={totalSigners}
            signers={signers}
          />
        </div>
        
        {/* Whitelist status */}
        {asset && (
          <div className="mb-4">
            <Alert variant={asset.isWhitelisted ? "success" : "warning"}>
              <AlertDescription>
                {asset.isWhitelisted 
                  ? "This token is whitelisted and can be withdrawn with standard approval requirements." 
                  : "This token is not whitelisted. Additional approvals may be required for security."}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </ModalBody>
      
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > asset.balance || loading}
          isLoading={loading}
        >
          {loading ? "Submitting..." : "Submit Withdrawal Request"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default WithdrawDialog;