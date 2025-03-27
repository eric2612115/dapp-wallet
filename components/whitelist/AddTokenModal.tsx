// components/whitelist/AddTokenModal.tsx
import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { VerifiedToken } from '@/types/whitelist';

interface AddTokenModalProps {
  open: boolean;
  onClose: () => void;
  onAddToken: (token: VerifiedToken) => void;
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({
  open,
  onClose,
  onAddToken
}) => {
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAddingToWhitelist, setIsAddingToWhitelist] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState<VerifiedToken | null>(null);

  // Reset state when modal closes
  const handleClose = () => {
    setNewTokenAddress('');
    setVerifiedToken(null);
    setIsVerifying(false);
    setIsAddingToWhitelist(false);
    onClose();
  };

  // Verify token address
  const verifyTokenAddress = () => {
    if (!newTokenAddress) return;
    
    setIsVerifying(true);
    
    // Mock API call to verify token
    setTimeout(() => {
      // For demo, just pretend it's verified
      setVerifiedToken({
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: newTokenAddress,
        decimals: 18
      });
      setIsVerifying(false);
    }, 1500);
  };

  // Add token to whitelist
  const handleAddTokenToWhitelist = () => {
    if (!verifiedToken) return;
    
    setIsAddingToWhitelist(true);
    
    // Mock API call to add token
    setTimeout(() => {
      onAddToken(verifiedToken);
      
      // Reset and close modal
      handleClose();
    }, 1500);
  };
  
  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Add Token to Whitelist"
      maxWidth="md"
    >
      <ModalBody>
        <div className="mb-4">
          <p className="text-warm-textSecondary dark:text-gray-400 mb-4">
            Enter a token contract address to add it to the whitelist.
          </p>
          
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              label="Token Contract Address"
              placeholder="0x..."
              value={newTokenAddress}
              onChange={(e) => setNewTokenAddress(e.target.value)}
              fullWidth
              disabled={isVerifying || !!verifiedToken}
            />
            <Button
              variant="default"
              onClick={verifyTokenAddress}
              disabled={!newTokenAddress || isVerifying || !!verifiedToken}
              isLoading={isVerifying}
              className="mt-2 md:mt-0 md:self-end"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
        
        {verifiedToken && (
          <div className="mt-6 p-4 bg-warm-bg dark:bg-dark-100 rounded-md">
            <h3 className="font-medium text-warm-text dark:text-white mb-2">
              Token Verified
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-warm-textSecondary dark:text-gray-400">Name:</span>
                <p className="font-medium text-warm-text dark:text-white">{verifiedToken.name}</p>
              </div>
              <div>
                <span className="text-warm-textSecondary dark:text-gray-400">Symbol:</span>
                <p className="font-medium text-warm-text dark:text-white">{verifiedToken.symbol}</p>
              </div>
              <div>
                <span className="text-warm-textSecondary dark:text-gray-400">Address:</span>
                <p className="font-medium text-warm-text dark:text-white font-mono text-xs">{verifiedToken.address}</p>
              </div>
              <div>
                <span className="text-warm-textSecondary dark:text-gray-400">Decimals:</span>
                <p className="font-medium text-warm-text dark:text-white">{verifiedToken.decimals}</p>
              </div>
            </div>
          </div>
        )}
        
        <Alert variant="warning" className="mt-4">
          <AlertDescription>
            Adding a token to the whitelist will allow it to be transferred with reduced signature requirements. Make sure you trust this token contract.
          </AlertDescription>
        </Alert>
      </ModalBody>
      
      <ModalFooter>
        <Button
          variant="default"
          onClick={handleClose}
          disabled={isAddingToWhitelist}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleAddTokenToWhitelist}
          disabled={!verifiedToken || isAddingToWhitelist}
          isLoading={isAddingToWhitelist}
        >
          {isAddingToWhitelist ? "Adding..." : "Add to Whitelist"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddTokenModal;