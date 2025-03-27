// components/dapps/ConnectDAppModal.tsx
import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { Globe as GlobeIcon, ShieldCheck as ShieldCheckIcon } from 'lucide-react';
import SignatureStatus from '@/components/multisig/SignatureStatus';
import { useWalletContext } from '@/contexts/WalletContext';

interface ConnectDAppModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  dapp?: {
    name?: string;
    logo?: string;
  };
  wallet: {
    name: string;
    requiredSignatures: number;
    totalSigners: number;
    multisig_address?: string;
  };
}

const ConnectDAppModal: React.FC<ConnectDAppModalProps> = ({
  open,
  onClose,
  url,
  dapp,
  wallet
}) => {
  const { addAlert } = useWalletContext();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  
  // Generate mock signers based on wallet
  const signers = Array.from({ length: wallet.totalSigners || 1 }, (_, i) => ({
    address: `0x${Math.random().toString(16).substring(2, 42)}`,
    name: i === 0 ? 'You' : `Co-signer ${i}`,
    hasSigned: i === 0 // Only the current user has signed initially
  }));
  
  // Handle DApp connection
  const handleConnect = () => {
    setConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
      
      addAlert({
        type: 'success',
        title: 'DApp Connected',
        message: `Successfully connected to ${dapp?.name || url}. Transaction requests will require signature approval.`
      });
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
        setConnected(false);
      }, 2000);
    }, 1500);
  };
  
  return (
    <Modal
      isOpen={open}
      onClose={!connecting ? onClose : () => {}}
      title={`Connect to ${dapp?.name || 'DApp'}`}
      maxWidth="md"
    >
      <ModalBody>
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-md bg-warm-bg dark:bg-dark-100 flex items-center justify-center mr-4 overflow-hidden">
            {dapp?.logo ? (
              <img src={dapp.logo} alt={dapp.name} className="w-full h-full object-cover" />
            ) : (
              <GlobeIcon className="h-8 w-8 text-warm-textSecondary dark:text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-warm-text dark:text-white">
              {dapp?.name || 'External DApp'}
            </h3>
            <p className="text-sm text-warm-textSecondary dark:text-gray-400">
              {url}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <ShieldCheckIcon className="h-5 w-5 text-warm-primary mr-2" />
            <h4 className="font-medium text-warm-text dark:text-white">
              Connection Details
            </h4>
          </div>
          
          <div className="p-4 bg-warm-bg dark:bg-dark-100 rounded-md mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-warm-textSecondary dark:text-gray-400">Wallet:</span>
              <span className="text-sm font-medium text-warm-text dark:text-white">{wallet.name}</span>
            </div>
            
            {wallet.multisig_address && (
              <div className="flex justify-between mb-2">
                <span className="text-sm text-warm-textSecondary dark:text-gray-400">Address:</span>
                <span className="text-sm font-mono text-warm-text dark:text-white">
                  {wallet.multisig_address.slice(0, 6)}...{wallet.multisig_address.slice(-4)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm text-warm-textSecondary dark:text-gray-400">Signatures Required:</span>
              <span className="text-sm font-medium text-warm-text dark:text-white">
                {wallet.requiredSignatures} of {wallet.totalSigners}
              </span>
            </div>
          </div>
          
          {wallet.requiredSignatures > 1 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-warm-text dark:text-white mb-2">
                Signature Status:
              </h5>
              <SignatureStatus
                requiredSignatures={wallet.requiredSignatures}
                totalSigners={wallet.totalSigners}
                signers={signers}
              />
            </div>
          )}
        </div>
        
        <Alert variant="warning">
          <AlertDescription>
            By connecting to this DApp, you allow it to view your wallet address and request transactions. 
            All transaction requests will require {wallet.requiredSignatures > 1 ? 'multiple signatures' : 'your signature'} before execution.
          </AlertDescription>
        </Alert>
      </ModalBody>
      
      <ModalFooter>
        <Button
          variant="default"
          onClick={onClose}
          disabled={connecting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConnect}
          disabled={connecting || connected}
          isLoading={connecting}
        >
          {connecting ? 'Connecting...' : connected ? 'Connected' : 'Connect'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConnectDAppModal;