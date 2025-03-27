'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletProvider, useWalletContext } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Shield as ShieldIcon, Save as SaveIcon, ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import AlertContainer from '@/components/shared/AlertContainer';

// Main container component with provider
const PolicyPage = () => {
  return (
    <WalletProvider>
      <PolicyManager />
      <AlertContainer />
    </WalletProvider>
  );
};

// Main policy manager component using wallet context
const PolicyManager = () => {
  const { isConnected, mounted, relatedMultisigWallets, selectedMultisigWalletAddress, setSelectedMultisigWalletAddress, addAlert } = useWalletContext();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Default policies (would be fetched from API in a real implementation)
  const [policies, setPolicies] = useState({
    whitelistedTransfer: 2,
    nonWhitelistedTransfer: 3,
    whitelistModification: 2,
    ownershipTransfer: 3,
    policyModification: 3
  });
  
  // Handle wallet selection change
  const handleWalletChange = (value: string) => {
    setSelectedMultisigWalletAddress(value);
  };
  
  // Handle policy change
  const handlePolicyChange = (key: keyof typeof policies, value: string) => {
    setPolicies(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
    setIsDirty(true);
  };
  
  // Handle save policies
  const handleSavePolicies = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      addAlert({
        type: 'success',
        title: 'Success',
        message: 'Policy changes have been submitted for approval'
      });
      setIsSaving(false);
      setIsDirty(false);
    }, 1500);
  };
  
  // Apply a template
  const applyTemplate = (template: {
    name: string;
    whitelistedTransfer: number;
    nonWhitelistedTransfer: number;
    whitelistModification: number;
    ownershipTransfer: number;
    policyModification: number;
  }) => {
    setPolicies(template);
    setIsDirty(true);
    
    addAlert({
      type: 'info',
      message: `Applied "${template.name}" template. Review and save to apply changes.`
    });
  };
  
  // Show nothing when not mounted (to prevent hydration issues)
  if (!mounted) {
    return null;
  }
  
  if (!isConnected) {
    return (
      <div className="text-center py-8 flex flex-col items-center justify-center bg-warm-paper dark:bg-dark-200 rounded-lg border border-warm-divider dark:border-dark-100">
        <div className="bg-warm-bg dark:bg-warm-primary/30 text-warm-primary dark:text-warm-secondary w-16 h-16 flex items-center justify-center rounded-full mb-2">
          <ShieldIcon size={32} />
        </div>
        <h2 className="text-xl font-semibold text-warm-text dark:text-white mb-2">
          Please connect your wallet to manage policies
        </h2>
        <p className="text-warm-textSecondary dark:text-gray-400 max-w-md mb-6">
          Connect your wallet to configure approval policies for your multi-signature wallets.
        </p>
      </div>
    );
  }
  
  // Find the selected wallet
  const selectedWallet = relatedMultisigWallets.find(wallet => 
    wallet.multisig_address === selectedMultisigWalletAddress
  );
  
  // Create options for the wallet selector
  const walletOptions = relatedMultisigWallets.map(wallet => ({
    value: wallet.multisig_address,
    label: `${wallet.name} (${wallet.requiredSignatures}/${wallet.totalSigners})`
  }));
  
  // Create signature options based on total signers
  const signatureOptions = Array.from(
    { length: selectedWallet?.totalSigners || 3 }, 
    (_, i) => ({ value: `${i + 1}`, label: `${i + 1} signatures` })
  );
  
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
            Approval Policy Management
          </h1>
          <p className="text-warm-textSecondary dark:text-gray-300">
            Configure approval requirements for different transaction types
          </p>
        </div>
      </div>
      
      {/* Select wallet */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Wallet</CardTitle>
          <CardDescription>
            Choose a multi-signature wallet to configure its approval policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            options={walletOptions}
            value={selectedMultisigWalletAddress}
            onChange={handleWalletChange}
            placeholder="Select a multi-signature wallet"
            fullWidth
          />
        </CardContent>
      </Card>
      
      {selectedWallet ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Transaction Approval Policies</CardTitle>
              <CardDescription>
                Configure how many signatures are required for different transaction types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Transaction Type</TableHead>
                    <TableHead>Required Signatures</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Whitelisted Token Transfer</TableCell>
                    <TableCell>
                      <Select
                        options={signatureOptions}
                        value={policies.whitelistedTransfer.toString()}
                        onChange={(value) => handlePolicyChange('whitelistedTransfer', value)}
                      />
                    </TableCell>
                    <TableCell className="text-warm-textSecondary dark:text-gray-400 text-sm">
                      Signatures required to transfer whitelisted tokens
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Non-whitelisted Token Transfer</TableCell>
                    <TableCell>
                      <Select
                        options={signatureOptions}
                        value={policies.nonWhitelistedTransfer.toString()}
                        onChange={(value) => handlePolicyChange('nonWhitelistedTransfer', value)}
                      />
                    </TableCell>
                    <TableCell className="text-warm-textSecondary dark:text-gray-400 text-sm">
                      Signatures required to transfer non-whitelisted tokens
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Whitelist Modification</TableCell>
                    <TableCell>
                      <Select
                        options={signatureOptions}
                        value={policies.whitelistModification.toString()}
                        onChange={(value) => handlePolicyChange('whitelistModification', value)}
                      />
                    </TableCell>
                    <TableCell className="text-warm-textSecondary dark:text-gray-400 text-sm">
                      Signatures required to add or remove tokens from whitelist
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ownership Transfer</TableCell>
                    <TableCell>
                      <Select
                        options={signatureOptions}
                        value={policies.ownershipTransfer.toString()}
                        onChange={(value) => handlePolicyChange('ownershipTransfer', value)}
                      />
                    </TableCell>
                    <TableCell className="text-warm-textSecondary dark:text-gray-400 text-sm">
                      Signatures required to add or remove wallet owners
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Policy Modification</TableCell>
                    <TableCell>
                      <Select
                        options={signatureOptions}
                        value={policies.policyModification.toString()}
                        onChange={(value) => handlePolicyChange('policyModification', value)}
                      />
                    </TableCell>
                    <TableCell className="text-warm-textSecondary dark:text-gray-400 text-sm">
                      Signatures required to modify these policy settings
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <Alert variant="info" className="mt-6">
                <AlertDescription>
                  Policy changes require approval from {policies.policyModification} out of {selectedWallet.totalSigners} signers to take effect.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleSavePolicies}
                  disabled={!isDirty || isSaving}
                  isLoading={isSaving}
                  startIcon={<SaveIcon className="w-4 h-4" />}
                >
                  {isSaving ? 'Saving Changes...' : 'Save Policy Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Policy Templates</CardTitle>
              <CardDescription>
                Apply pre-configured policy templates to your wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-warm-divider dark:border-dark-100 rounded-md hover:bg-warm-bg dark:hover:bg-dark-100 transition-colors cursor-pointer"
                  onClick={() => applyTemplate({
                    name: "Basic Security",
                    whitelistedTransfer: 1,
                    nonWhitelistedTransfer: 2,
                    whitelistModification: 2,
                    ownershipTransfer: 3,
                    policyModification: 2
                  })}
                >
                  <h3 className="text-lg font-medium text-warm-text dark:text-white mb-2">Basic Security</h3>
                  <p className="text-sm text-warm-textSecondary dark:text-gray-400 mb-2">
                    Balanced security for everyday use. Single approval for whitelisted tokens.
                  </p>
                  <div className="text-xs border-t border-warm-divider dark:border-dark-100 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Whitelisted transfers:</span>
                      <span className="font-bold">1 signature</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Non-whitelisted:</span>
                      <span className="font-bold">2 signatures</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-warm-divider dark:border-dark-100 rounded-md hover:bg-warm-bg dark:hover:bg-dark-100 transition-colors cursor-pointer"
                  onClick={() => applyTemplate({
                    name: "High Security",
                    whitelistedTransfer: 2,
                    nonWhitelistedTransfer: 3,
                    whitelistModification: 3,
                    ownershipTransfer: 3,
                    policyModification: 3
                  })}
                >
                  <h3 className="text-lg font-medium text-warm-text dark:text-white mb-2">High Security</h3>
                  <p className="text-sm text-warm-textSecondary dark:text-gray-400 mb-2">
                    Enhanced security for valuable assets. Multiple approvals for all actions.
                  </p>
                  <div className="text-xs border-t border-warm-divider dark:border-dark-100 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Whitelisted transfers:</span>
                      <span className="font-bold">2 signatures</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Non-whitelisted:</span>
                      <span className="font-bold">3 signatures</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-warm-divider dark:border-dark-100 rounded-md hover:bg-warm-bg dark:hover:bg-dark-100 transition-colors cursor-pointer"
                  onClick={() => applyTemplate({
                    name: "Custom Balance",
                    whitelistedTransfer: 2,
                    nonWhitelistedTransfer: 2,
                    whitelistModification: 2,
                    ownershipTransfer: 3,
                    policyModification: 2
                  })}
                >
                  <h3 className="text-lg font-medium text-warm-text dark:text-white mb-2">Custom Balance</h3>
                  <p className="text-sm text-warm-textSecondary dark:text-gray-400 mb-2">
                    Equal approval thresholds for most operations with stricter rules for ownership.
                  </p>
                  <div className="text-xs border-t border-warm-divider dark:border-dark-100 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Most operations:</span>
                      <span className="font-bold">2 signatures</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Ownership change:</span>
                      <span className="font-bold">3 signatures</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-8 bg-warm-paper dark:bg-dark-200 rounded-lg border border-warm-divider dark:border-dark-100">
          <p className="text-warm-textSecondary dark:text-gray-400 mb-4">
            Please select a multi-signature wallet to manage its policies.
          </p>
          {relatedMultisigWallets.length === 0 && (
            <Button
              variant="primary"
              onClick={() => router.push('/multisig')}
            >
              Create a Multi-signature Wallet
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PolicyPage;