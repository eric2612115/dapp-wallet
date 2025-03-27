'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletProvider, useWalletContext } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { ChevronLeft as ChevronLeftIcon, Plus as PlusIcon, Save as SaveIcon, Trash2 as TrashIcon } from 'lucide-react';
import Select from '@/components/ui/Select';
import AlertContainer from '@/components/shared/AlertContainer';

// Main container component with provider
const CreateMultisigPage = () => {
  return (
    <WalletProvider>
      <CreateMultisig />
      <AlertContainer />
    </WalletProvider>
  );
};

// Main create multisig component using wallet context
const CreateMultisig = () => {
  const { isConnected, mounted, address, addAlert, handleCreateMultisig } = useWalletContext();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [walletName, setWalletName] = useState('');
  const [requiredSignatures, setRequiredSignatures] = useState('2');
  const [signers, setSigners] = useState<{ address: string; name: string }[]>([
    { address: address || '', name: 'You (Owner)' }
  ]);
  const [newSignerAddress, setNewSignerAddress] = useState('');
  const [newSignerName, setNewSignerName] = useState('');
  
  // Add a new signer
  const addSigner = () => {
    if (!newSignerAddress || !newSignerName) return;
    
    // Check if address is already in signers
    if (signers.some(s => s.address.toLowerCase() === newSignerAddress.toLowerCase())) {
      addAlert({
        type: 'error',
        title: 'Duplicate Address',
        message: 'This address is already added as a signer.'
      });
      return;
    }
    
    setSigners([...signers, { address: newSignerAddress, name: newSignerName }]);
    setNewSignerAddress('');
    setNewSignerName('');
  };
  
  // Remove a signer
  const removeSigner = (index: number) => {
    // Don't allow removing the first signer (the owner)
    if (index === 0) return;
    
    const newSigners = [...signers];
    newSigners.splice(index, 1);
    setSigners(newSigners);
    
    // If required signatures is now more than total signers, adjust it
    if (parseInt(requiredSignatures) > newSigners.length) {
      setRequiredSignatures(newSigners.length.toString());
    }
  };
  
  // Handle create wallet
  const createWallet = async () => {
    if (!walletName || signers.length < parseInt(requiredSignatures)) return;
    
    setIsCreating(true);
    
    try {
      // In a real app, we would call our API here
      await handleCreateMultisig();
      
      addAlert({
        type: 'success',
        title: 'Success',
        message: `${walletName} multi-signature wallet created successfully!`
      });
      
      // Redirect to multisig page
      router.push('/multisig');
    } catch (error) {
      console.error('Failed to create multi-signature wallet:', error);
      addAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to create multi-signature wallet. Please try again.'
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Options for required signatures select
  const signatureOptions = Array.from(
    { length: signers.length },
    (_, i) => ({ value: `${i + 1}`, label: `${i + 1} of ${signers.length} signatures` })
  );
  
  // Form validation
  const isValid = walletName.trim() !== '' && 
    signers.length >= parseInt(requiredSignatures) &&
    parseInt(requiredSignatures) > 0;
  
  // Show nothing when not mounted (to prevent hydration issues)
  if (!mounted) {
    return null;
  }
  
  if (!isConnected) {
    return (
      <div className="text-center py-8 flex flex-col items-center justify-center bg-warm-paper dark:bg-dark-200 rounded-lg border border-warm-divider dark:border-dark-100">
        <h2 className="text-xl font-semibold text-warm-text dark:text-white mb-2">
          Please connect your wallet to create a multi-signature wallet
        </h2>
        <p className="text-warm-textSecondary dark:text-gray-400 max-w-md mb-6">
          Connect your wallet to create and configure a new multi-signature wallet.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => router.push('/multisig')}
          startIcon={<ChevronLeftIcon className="w-4 h-4" />}
        >
          Back to Wallets
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-warm-text dark:text-white">
            Create Multi-Signature Wallet
          </h1>
          <p className="text-warm-textSecondary dark:text-gray-300">
            Configure a new wallet with multiple signers and custom approval requirements
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the essential details for your new multi-signature wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Wallet Name"
                placeholder="e.g., DAO Treasury"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                fullWidth
              />
              
              <div>
                <label className="block text-sm font-medium text-warm-text dark:text-gray-300 mb-1">
                  Required Signatures
                </label>
                <Select
                  options={signatureOptions}
                  value={requiredSignatures}
                  onChange={setRequiredSignatures}
                  placeholder="Select required signatures"
                  fullWidth
                />
                <p className="mt-1 text-xs text-warm-textSecondary dark:text-gray-400">
                  Number of signatures required to approve transactions
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Signers Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Signers</CardTitle>
              <CardDescription>
                Configure the signers that can approve transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {signers.map((signer, index) => (
                  <div key={index} className="flex items-center p-3 border border-warm-divider dark:border-dark-100 rounded-md bg-warm-bg dark:bg-dark-100">
                    <div className="flex-grow">
                      <p className="font-medium text-warm-text dark:text-white">{signer.name}</p>
                      <p className="text-xs text-warm-textSecondary dark:text-gray-400 font-mono">
                        {signer.address.slice(0, 10)}...{signer.address.slice(-8)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSigner(index)}
                      disabled={index === 0} // Don't allow removing the owner
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-warm-divider dark:border-dark-100 pt-4">
                <h4 className="text-sm font-medium text-warm-text dark:text-white mb-2">
                  Add Another Signer
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <Input
                    placeholder="Signer Address (0x...)"
                    value={newSignerAddress}
                    onChange={(e) => setNewSignerAddress(e.target.value)}
                  />
                  <Input
                    placeholder="Signer Name/Label"
                    value={newSignerName}
                    onChange={(e) => setNewSignerName(e.target.value)}
                  />
                </div>
                <Button
                  variant="default"
                  onClick={addSigner}
                  disabled={!newSignerAddress || !newSignerName}
                  startIcon={<PlusIcon className="w-4 h-4" />}
                >
                  Add Signer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Summary Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-warm-textSecondary dark:text-gray-400">Wallet Name</p>
                  <p className="font-medium text-warm-text dark:text-white">
                    {walletName || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-warm-textSecondary dark:text-gray-400">Approval Threshold</p>
                  <p className="font-medium text-warm-text dark:text-white">
                    {requiredSignatures} of {signers.length} signatures
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-warm-textSecondary dark:text-gray-400">Number of Signers</p>
                  <p className="font-medium text-warm-text dark:text-white">{signers.length} signers</p>
                </div>
                
                <Alert variant="info">
                  <AlertDescription>
                    Once created, you will need to fund this wallet to start using it.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                variant="primary"
                onClick={createWallet}
                disabled={!isValid || isCreating}
                isLoading={isCreating}
                startIcon={<SaveIcon className="w-4 h-4" />}
                fullWidth
              >
                {isCreating ? 'Creating Wallet...' : 'Create Multi-Signature Wallet'}
              </Button>
              
              <Button
                variant="default"
                onClick={() => router.push('/multisig')}
                disabled={isCreating}
                fullWidth
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateMultisigPage;