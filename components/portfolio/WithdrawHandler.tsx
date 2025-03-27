// components/portfolio/WithdrawHandler.tsx
import React, { useState } from 'react';
import { useWithdraw } from '@/lib/hooks/useWithdraw';
import Button from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { CallMade as WithdrawIcon } from '@mui/icons-material';
import type { Asset } from '@/types/assets';

interface WithdrawHandlerProps {
  asset: Asset;
  multisigWalletAddress: string;
  walletName: string;
  onSuccess: (message: string) => void;
}

const WithdrawHandler: React.FC<WithdrawHandlerProps> = ({
  asset,
  multisigWalletAddress,
  walletName,
  onSuccess
}) => {
  const [open, setOpen] = useState(false);
  const { withdrawing, withdrawError, handleWithdraw } = useWithdraw();
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleSubmit = async () => {
    await handleWithdraw(
      asset,
      multisigWalletAddress,
      walletName,
      (message: string) => {
        onSuccess(message);
        handleClose();
      }
    );
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        startIcon={<WithdrawIcon />}
        onClick={handleOpen}
      >
        Withdraw
      </Button>
      
      <Modal 
        isOpen={open} 
        onClose={!withdrawing ? handleClose : () => {}}
        title={`Withdraw ${asset.symbol}`}
        maxWidth="sm"
      >
        <ModalBody className="py-4">
          <p className="text-gray-800 dark:text-gray-200 mb-2">
            You are about to withdraw:
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {asset.balance} {asset.symbol} (${asset.value.toLocaleString()})
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This asset will be withdrawn from {walletName} to your personal wallet.
          </p>
          
          {!asset.isWhitelisted && (
            <Alert variant="warning" className="mb-4">
              <AlertDescription>
                This token is not whitelisted. The withdrawal may require additional approval from other wallet owners.
              </AlertDescription>
            </Alert>
          )}
          
          {withdrawError && (
            <Alert variant="error" className="mt-4">
              <AlertDescription>{withdrawError}</AlertDescription>
            </Alert>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="default" 
            onClick={handleClose} 
            disabled={withdrawing}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleSubmit}
            disabled={withdrawing}
            isLoading={withdrawing}
          >
            {withdrawing ? 'Processing...' : 'Confirm Withdrawal'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default WithdrawHandler;