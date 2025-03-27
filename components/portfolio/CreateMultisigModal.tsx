// components/portfolio/CreateMultisigModal.tsx
import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface CreateMultisigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateMultisigModal: React.FC<CreateMultisigModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [walletName, setWalletName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWallet = async () => {
    if (!address) {
      setError('Your wallet address is not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call the success callback
      onSuccess();
      
      // Close the modal
      handleClose();
    } catch (err) {
      console.error('Failed to create multi-sig wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setWalletName('');
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <Modal 
      isOpen={open} 
      onClose={loading ? () => {} : handleClose}
      title="Create New Multi-signature Wallet"
      maxWidth="md"
    >
      <ModalBody>
        <div className="mt-4">
          <Input
            label="Wallet Name"
            placeholder="My Multi-sig Wallet"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            disabled={loading}
            fullWidth
          />

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            This will create a new multi-signature wallet where you and your AI assistant
            both have control. All transactions from this wallet will require approval.
          </p>

          {/* Chain info */}
          <div className="mt-4 p-4 bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-100 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Wallet Details</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Network: {chainId ? 
                chainId === 1 ? 'Ethereum Mainnet' : 
                chainId === 137 ? 'Polygon' : 
                chainId === 56 ? 'BNB Smart Chain' : 
                `Chain ID: ${chainId}` : 'Unknown'
              }
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Owner: {address ? 
                `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
                'Not connected'
              }
            </p>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="error" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button 
          variant="default"
          onClick={handleClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="primary"
          onClick={handleCreateWallet}
          disabled={loading || !address}
          isLoading={loading}
        >
          Create Wallet
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateMultisigModal;